export async function existsWasm(FS: any, path: string): Promise<boolean> {
  const info = await FS.analyzePath(path, true);
  return info.exists;
}

export async function writeFileWasm(
  FS: any,
  fileData: Uint8Array | undefined,
  filePath: string,
) {
  return await FS.writeFile(filePath, fileData, { encoding: 'binary' });
}

export async function readFileWasm(FS: any, filePath: string) {
  return await FS.readFile(filePath, { encoding: 'binary' });
}

export async function mkdirWasm(FS: any, path: string) {
  await FS.mkdir(path);
}

export async function removeFileWasm(FS: any, filePath: string) {
  await FS.unlink(filePath);
}

export async function writeFileLocal(
  fileData: any,
  directoryHandle: any,
  fileName: string,
) {
  const blob = new Blob([fileData], { type: 'application/octet-stream' });
  const fileHandle = await directoryHandle.getFileHandle(fileName, {
    create: true,
  });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
}

export async function checkSecretkey(FS: any): Promise<boolean> {
  const ls = FS.readdir('./') as string[];
  if (!ls.includes('secretkey.bin')) {
    console.log('there is no secretkey.bin file at wasm FS.');
    return false;
  }
  return true;
}
