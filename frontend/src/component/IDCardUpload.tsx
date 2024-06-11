import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import style from "../constant/style";
import ImageUploadIcon from "./ImageUploadIcon"
import * as faceapi from 'face-api.js';
import { loadModels, normalize, updateID } from "../store/slices/user";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import CryptoCard from "./CryptoCard";

type PhotoInfo = {
  file: File | null;
  src: string;
}
const initPhotoInfo = (): PhotoInfo => (
  {
    file: null,
    src: "plus.jpeg",
  }
);

export interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}

export default function IDCardUpload({
  setStep
}: IProps) {
  const [photoInfos, setPhotoInfos] = useState<PhotoInfo>(initPhotoInfo());
  const dispatch = useDispatch<AppDispatch>();

  const setIthPhoto = useCallback((file: File) => {
    const newPhoto = { file, src: URL.createObjectURL(file) };
    console.log(newPhoto.src);
    setPhotoInfos(newPhoto);
  }, [photoInfos, setPhotoInfos]);


  const confirmOnClick = useCallback(() => {
    dispatch(updateID(photoInfos.src))
    .then(() => {
      setStep(2);
    })
    .catch((error) => {
      console.error('Update ID failed:', error);
    });
  }, [dispatch, photoInfos.src, setStep]);

  return (
    <section className={""}>
        <CryptoCard setStep={setStep}/>
        <h2 className={"text-center text-2xl text-black-800 font-bold mt-10 my-4"}>
            본인 인증
        </h2>
      <section className={"flex-1 flex flex-col justify-center"}>
        <ImageUploadIcon
                src={photoInfos.src}
                setIthPhoto={setIthPhoto}
        />
      </section>
      <article className={`text-center text-black-800 mb-6`}>
        ※ 신분증을 정중앙에 위치시켜 주세요. 
      </article>
      <section className={"flex flex-row w-full justify-center"}>
        <button
          className={"w-24 min-h-8 h-8 rounded-md bg-indigo-800 text-center text-white justify-center"}
          onClick={confirmOnClick}
        >
          촬영
        </button>
      </section>
    </section>
  );
}