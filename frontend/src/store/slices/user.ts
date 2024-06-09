import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Cookies } from "react-cookie";
import axios from "axios";
import { RootState } from "../index";
import { HEaaNEnv } from '../../util/HEaaN';
import * as faceapi from 'face-api.js';
import { backendUrl } from "../url";


export interface userState {
    key: Uint8Array | null
    loading: boolean
    image: Float64Array | null
    idcard: Float64Array | null
    embedding: Uint8Array | null
    sim : Float64Array | null
    token: string | null
}

const initialState: userState = {
    key: null,
    loading: false,
    image: null,
    idcard: null,
    embedding: null,
    sim: null,
    token: null,
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
    async (user: { identification: string; password: string }) => {
        try {
            const signInResponse = await axios.post(`${backendUrl}/user/login/`, user);
            if (signInResponse.status !== 200) {
                return false;
            }
            const sessionToken = signInResponse.data.token;
            const cookies = new Cookies();
            cookies.set("sessionid", sessionToken, { path: "/" });
            return sessionToken;
      } catch (_) {
        return null;
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
    async (src:string): Promise<Float64Array | null> => {
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

export const cosine_sim = createAsyncThunk(
    "user/cosine_sim",
    async (data: {photo:Float64Array | null, id:Float64Array | null}) => {
        try{
            const { photo, id } = data;
            console.log(photo);
            if (photo != null && id != null) {
                const heaan = await new HEaaNEnv("IDASH");
                await heaan.genSk();
                await heaan.genEncKey();

                const photo_enc = await heaan.encrypt(photo);
                const id_enc = await heaan.encrypt(id);

    
                const face_blob = new Blob([photo_enc], { type: 'application/octet-stream' });
                const face = new File([face_blob], 'face.bin', { type: 'application/octet-stream' });
    
                const id_blob = new Blob([id_enc], { type: 'application/octet-stream' });
                const id_card = new File([id_blob], 'id.bin', { type: 'application/octet-stream' });
    
                const formData = new FormData();
                formData.append('face', face);
                formData.append('id_card', id_card);
    
                const response = await axios.post(`${backendUrl}/user/similarity/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    responseType: 'arraybuffer',
                });
                
                const similarityData = new Uint8Array(response.data);
                const dec = await heaan.decrypt(similarityData);
                console.log(dec);
                console.log(dec[0] * (1 << 10));
                return dec[0] * (1 << 10);
            }
            else{
                return null;
            }
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
                state.token = action.payload;
            }
        )
    }
});

export const selectUser = (state: RootState) => state.user;
const userReducer = userSlice.reducer;
export default userReducer;