import Module from './HEaaN-wasm.js';
import * as wasmfs from './wasmfs';

const SK_PATH = '/secretkey.bin';
const ENC_PATH = '/PK/EncKey.bin';

function getStringFromMemory(memory: any, address: any) {
  const bytes = new Uint8Array(memory);
  let string = '';
  for (let i = address; bytes[i] !== 0; i++) {
    string += String.fromCharCode(bytes[i]);
  }
  return string;
}

export class HEaaNEnv {
  mod: any;
  fs: any;
  context: number | undefined;

  constructor(preset: string) {
    return (async (): Promise<HEaaNEnv> => {
      try {
        this.mod = await Module();
        this.fs = await this.mod.FS;
        this.context = await this.mod.ccall(
          'createContext',
          'number',
          ['string'],
          [preset],
        );
        return this;
      } catch (e) {
        throw new Error(
          `Failed to create HEaan Context with preset: ${preset}`,
        );
      }
    })() as unknown as HEaaNEnv;
  }

  async cleanUp() {
    try {
      await this.mod.ccall('releaseContext', null, ['number'], [this.context]);
    } catch (e) {
      throw new Error(`Failed to cleanup HEaaN context: ${e}`);
    }

    this.mod = null;
  }

  maxNumElements(): number {
    return this.mod.cwrap('numSlots', 'number', ['number'])(this.context);
  }

  getHEaaNVersion(): string {
    return getStringFromMemory(
      this.mod.HEAPU8,
      this.mod.cwrap('getHEaaNVersion', 'number', null)(),
    );
  }

  getWasmVersion(): string {
    return getStringFromMemory(
      this.mod.HEAPU8,
      this.mod.cwrap('getWasmVersion', 'number', null)(),
    );
  }

  async skExists(): Promise<boolean> {
    return await wasmfs.existsWasm(this.fs, SK_PATH);
  }

  async genSk(): Promise<void> {
    try {
      await this.mod.ccall(
        'generateSecretKey',
        null,
        ['number'],
        [this.context],
      );
    } catch (e) {
      throw new Error(`Failed to generate secret key: ${e}`);
    }
  }

  async setSk(sk: Uint8Array): Promise<void> {
    try {
      await wasmfs.writeFileWasm(this.fs, sk, SK_PATH);
    } catch (e) {
      throw new Error(`Failed to set secret key: ${e}`);
    }
  }

  async getSk(): Promise<Uint8Array> {
    try {
      return await wasmfs.readFileWasm(this.fs, SK_PATH);
    } catch (e) {
      throw new Error(`Failed to read secret key: ${e}`);
    }
  }

  async genEncKey(): Promise<void> {
    try {
      await this.mod.ccall('genEncKey', null, ['number'], [this.context]);
    } catch (e) {
      throw new Error(`Failed to generate encryption key: ${e}`);
    }
  }

  async getEncKey(): Promise<Uint8Array> {
    try {
      return await wasmfs.readFileWasm(this.fs, ENC_PATH);
    } catch (e) {
      throw new Error(`Failed to read encryption key: ${e}`);
    }
  }

  async setEncKey(ek: Uint8Array): Promise<void> {
    try {
      if (!(await wasmfs.existsWasm(this.fs, 'PK'))) {
        await wasmfs.mkdirWasm(this.fs, 'PK');
      }
      await wasmfs.writeFileWasm(this.fs, ek, ENC_PATH);
    } catch (e) {
      throw new Error(`Failed to set encryption key: ${e}`);
    }
  }

  async genMultKey(): Promise<void> {
    try {
      await this.mod.ccall('genMultKey', null, ['number'], [this.context]);
    } catch (e) {
      throw new Error(`Failed to generate mult key: ${e}`);
    }
  }

  async genConjKey(): Promise<void> {
    try {
      await this.mod.ccall('genConjKey', null, ['number'], [this.context]);
    } catch (e) {
      throw new Error(`Failed to generate conj key: ${e}`);
    }
  }

  numRotIndices(): number {
    return this.mod.cwrap('numRotIndices', null, ['number'])(this.context);
  }

  async genRotKey(startIndex: number, endIndex: number): Promise<boolean> {
    const numRotIndices = this.numRotIndices();
    if (
      startIndex < 0 ||
      startIndex >= numRotIndices ||
      endIndex < 0 ||
      endIndex > numRotIndices
    ) {
      console.error(
        `Rotation key index should be in range [1, ${numRotIndices})`,
      );
      return false;
    }
    if (startIndex >= endIndex) {
      console.error('startIndex should be less than endIndex.');
      return false;
    }
    await this.mod.ccall(
      'generateRotKeys',
      null,
      ['number', 'int', 'int'],
      [this.context, startIndex, endIndex],
    );
    return true;
  }

  async _genCiphertextName(): Promise<string> {
    let res;
    do {
      res = `ctxt_${crypto.randomUUID()}.bin`;
    } while (await wasmfs.existsWasm(this.fs, res));
    return res;
  }

  async encrypt(
    arr: Float64Array,
    targetLevel: number = -1,
  ): Promise<Uint8Array> {
    // TODO: Check encryption key exists
    try {
      const ctxtName = await this._genCiphertextName();
      const bytesPerElement = 8;
      const arrPtr = this.mod._malloc(arr.length * bytesPerElement);
      this.mod.HEAPF64.set(arr, arrPtr / bytesPerElement);
      await this.mod.ccall(
        'encrypt',
        null,
        ['number', 'number', 'number', 'string', 'number'],
        [this.context, arrPtr, arr.length, ctxtName, targetLevel],
      );
      this.mod._free(arrPtr);
      const res = await this._getCiphertext(ctxtName);
      await this._removeCiphertext(ctxtName);
      return res;
    } catch (e) {
      throw new Error(`Failed to encrypt: ${e}`);
    }
  }

  async decrypt(ct: Uint8Array): Promise<Float64Array> {
    const ctxtName = await this._addCiphertext(ct);
    const numSlots = this.maxNumElements();
    const bytesPerElement = 8;
    const resultPtr = this.mod._malloc(numSlots * bytesPerElement);
    await this.mod.ccall(
      'decrypt',
      null,
      ['number', 'string', 'number'],
      [this.context, ctxtName, resultPtr],
    );
    const dmsg = new Float64Array(
      this.mod.HEAPF64.buffer,
      resultPtr,
      numSlots,
    ).slice();
    this.mod._free(resultPtr);
    await this._removeCiphertext(ctxtName);
    return dmsg;
  }

  async _addCiphertext(ct: Uint8Array, path: string | null | undefined = null) {
    if (!path) {
      path = await this._genCiphertextName();
    }
    await wasmfs.writeFileWasm(this.fs, ct, path);
    return path;
  }

  async _getCiphertext(name: string): Promise<Uint8Array> {
    return await wasmfs.readFileWasm(this.fs, name);
  }

  async _removeCiphertext(path: string) {
    await wasmfs.removeFileWasm(this.fs, path);
  }

  _isString(o: any): boolean {
    return typeof o === 'string' || o instanceof String;
  }

  async addSub(
    method: string,
    op1: Uint8Array,
    op2: Uint8Array | Float64Array,
  ): Promise<Uint8Array> {
    // Check method
    if (method !== 'add' && method !== 'sub') {
      throw new Error('The method should be either "add" or "sub"');
    }

    // op1 should be ciphertext in Uint8Array
    if (op1.constructor !== Uint8Array) {
      throw Error('The first operand should be a ciphertext in Uint8Array.');
    }

    // Store op1
    const op1Name = await this._addCiphertext(op1);

    // Reserve result path
    const resName = await this._genCiphertextName();
    await wasmfs.writeFileWasm(this.fs, new Uint8Array(), resName);

    const bytesPerElement = 8;
    let methodName;
    if (op2.constructor === Uint8Array) {
      if (op1.length !== op2.length) {
        throw new Error(
          `Two ciphertexts have different length in ${methodName}: ${op1.length}, ${op2.length}`,
        );
      }
      try {
        // Ciphertext and Ciphertext
        methodName = method + 'CtxtCtxt';
        const op2Name = await this._addCiphertext(op2);
        await this.mod.ccall(
          methodName,
          null,
          ['number', 'string', 'string', 'string'],
          [this.context, op1Name, op2Name, resName],
        );
        await this._removeCiphertext(op2Name);
      } catch (e) {
        throw new Error(`Failed to ${methodName} ciphertext`);
      }
    } else if (op2.constructor === Float64Array) {
      try {
        if (op2.length !== this.maxNumElements()) {
          throw new Error(
            `The size of message should be ${this.maxNumElements()}, but ${
              op2.length
            } is given.`,
          );
        }

        methodName = method + 'CtxtMsg';
        const ptr = this.mod._malloc(op2.length * bytesPerElement);
        const op2InMem = new Float64Array(
          this.mod.HEAPF64.buffer,
          ptr,
          op2.length,
        );
        op2InMem.set(op2);
        await this.mod.ccall(
          methodName,
          null,
          ['number', 'string', 'number', 'number', 'string'],
          [
            this.context,
            op1Name,
            op2InMem.byteOffset,
            op2InMem.length,
            resName,
          ],
        );
        this.mod._free(ptr);
      } catch (e) {
        throw new Error(`Failed to ${methodName} message`);
      }
    } else {
      throw new Error(
        'The second operand should be either a ciphertext in Uint8Array or a message in Float64Array.',
      );
    }
    const res = await this._getCiphertext(resName);
    await this._removeCiphertext(op1Name);
    await this._removeCiphertext(resName);
    return res;
  }

  async add(
    op1: Uint8Array,
    op2: Uint8Array | Float64Array,
  ): Promise<Uint8Array> {
    return await this.addSub('add', op1, op2);
  }

  async sub(
    op1: Uint8Array,
    op2: Uint8Array | Float64Array,
  ): Promise<Uint8Array> {
    return await this.addSub('sub', op1, op2);
  }
}
