import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import axios from "axios";
import { RootState } from "../index";
import { HEaaNEnv } from '../../util/HEaaN';
import * as faceapi from 'face-api.js';


export interface userState {
    key: null | Uint8Array
    loading: boolean
    image: Float64Array | null
    idcard: Float64Array | null
    embedding: Uint8Array | null
    loginUser: boolean
}

const initialState: userState = {
    key: null,
    loading: false,
    image: null,
    idcard: null,
    embedding: null,
    loginUser: false,
};

export async function loadModels() {
    const MODEL_URL = process.env.PUBLIC_URL + "/models";
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');

    console.log('Tiny Face Detector model loaded.');
}

export const updateResults = createAsyncThunk(
    "faceDetection/updateResults",
    async () => {
        const heaan = await new HEaaNEnv("IDASH");
        try {
            if (!faceapi.nets.faceRecognitionNet.isLoaded) {
                await loadModels();
            }
            const inputImgEl = new Image();
            inputImgEl.src = process.env.PUBLIC_URL+ "/dataset/0016_camera.jpg";
            
            await new Promise((resolve, reject) => {
                inputImgEl.onload = resolve;
                inputImgEl.onerror = () => reject(new Error('Failed to load image'));
            });

            const options = new faceapi.TinyFaceDetectorOptions();

            const detections = await faceapi.detectAllFaces(inputImgEl).withFaceLandmarks().withFaceDescriptors();
            const faceEmbedding = detections[0].descriptor;
            const normalize_emb = normalize(new Float64Array(faceEmbedding));


            await heaan.genSk();
            await heaan.genEncKey();
            const secretKey = await heaan.getEncKey();
            const ret = await heaan.encrypt(normalize_emb);
            console.log(secretKey);
            console.log(ret);
            const dec = await heaan.decrypt(ret);
            let val = 0.0;
            for(let i = 0; i < normalize_emb.length; i++){
                val += normalize_emb[i]*normalize_emb[i];
            }
            console.log(val);
            val = 0.0;
            for(let i = 0; i < dec.length; i++){
                val += dec[i]*dec[i];
            }
            console.log(val);
            const data = {
                key: secretKey,
                image: normalize_emb,
                embedding: ret
            };
            return data;
        } catch (e) {
            console.error(e);
            const data = {
                key: null,
                image: null,
                embedding: null
            };
            return data;
        }
    }
);

export const fetchLogin = createAsyncThunk(
    "user/signin",
    async (user: { identification: string; password: string }): Promise<boolean> => {
      try {
        // get session token
        const signInResponse = await axios.post("/user/login/", user);
        if (signInResponse.status !== 200) {
          return false;
        }
        const sessionToken = signInResponse.data.token;
        const cookies = new Cookies();
        cookies.set("sessionid", sessionToken, { path: "/" });
        return true;
      } catch (_) {
        return false;
      }
    }
);

export const updatePhoto = createAsyncThunk(
    "faceDetection/updatePhoto",
    async (src:string) => {
        try {
            if (!faceapi.nets.faceRecognitionNet.isLoaded) {
                await loadModels();
            }
            const inputImgEl = new Image();
            inputImgEl.src = src;
            
            await new Promise((resolve, reject) => {
                inputImgEl.onload = resolve;
                inputImgEl.onerror = () => reject(new Error('Failed to load image'));
            });

            const options = new faceapi.TinyFaceDetectorOptions();

            const detections = await faceapi.detectAllFaces(inputImgEl).withFaceLandmarks().withFaceDescriptors();
            const faceEmbedding = detections[0].descriptor;
            const normalize_emb = normalize(new Float64Array(faceEmbedding));
            return normalize_emb;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
);

export const updateID = createAsyncThunk(
    "faceDetection/updateID",
    async (src:string) => {
        try {
            if (!faceapi.nets.faceRecognitionNet.isLoaded) {
                await loadModels();
            }
            const inputImgEl = new Image();
            inputImgEl.src = src;
            
            await new Promise((resolve, reject) => {
                inputImgEl.onload = resolve;
                inputImgEl.onerror = () => reject(new Error('Failed to load image'));
            });

            const options = new faceapi.TinyFaceDetectorOptions();

            const detections = await faceapi.detectAllFaces(inputImgEl).withFaceLandmarks().withFaceDescriptors();
            const faceEmbedding = detections[0].descriptor;
            const normalize_emb = normalize(new Float64Array(faceEmbedding));
            return normalize_emb;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
);

export function normalize(array: Float64Array): Float64Array {
    if (array.length === 0) {
      throw new Error("Array cannot be empty.");
    }
  
    let norm = 0;
    for (let i = 0; i < array.length; i++) {
      norm += array[i] * array[i];
    }
    norm = Math.sqrt(norm);
  
    if (norm === 0) {
      throw new Error("Normalization is not possible when norm is zero.");
    }
  
    const normalizedArray = new Float64Array(array.length);
    for (let i = 0; i < array.length; i++) {
      normalizedArray[i] = array[i] / norm;
    }
  
    return normalizedArray;
  }

export const getKey = createAsyncThunk(
    "user/getkey",
    async () => {
        const heaan = await new HEaaNEnv("IDASH");
        try {
            await heaan.genSk();
            await heaan.genEncKey();
            const secretKey = await heaan.getEncKey();
            return secretKey
        } catch (e) {
            console.error(e);
            return null;
        }
    }
)

export const enc = createAsyncThunk(
    "user/enc",
    async (image: Float64Array) => {
        const heaan = await new HEaaNEnv("IDASH");
        try{
            await heaan.genSk();
            await heaan.genEncKey();
            const secretKey = await heaan.getEncKey();
            const ret = await heaan.encrypt(image);
            console.log(secretKey);
            console.log(ret);
            const dec = await heaan.decrypt(ret);
            console.log(dec);
            return ret;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(
            getKey.pending,
            (state) => {
                state.loading = true;
            }
        )
        builder.addCase(
            getKey.fulfilled,
            (state, action) => {
                state.key = action.payload;
                state.loading = false;
            }
        )
        builder.addCase(
            updateResults.fulfilled,
            (state, action) => {
                state.key = action.payload?.key;
                state.image = action.payload?.image;
                state.embedding = action.payload?.embedding;
            }
        )
        builder.addCase(
            enc.fulfilled,
            (state, action) => {
                state.embedding = action.payload;
            }
        )
        builder.addCase(
            updatePhoto.fulfilled,
            (state, action) => {
                state.image = action.payload;
            }
        )
        builder.addCase(
            updateID.fulfilled,
            (state, action) => {
                state.idcard = action.payload;
            }
        )
        builder.addCase(
            fetchLogin.fulfilled,
            (state, action) => {
                state.loginUser = action.payload;
            }
        )
    }
});

export const selectUser = (state: RootState) => state.user;
const userReducer = userSlice.reducer;
export default userReducer;