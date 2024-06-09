import React, { Dispatch, SetStateAction, useCallback, useState, useEffect} from "react";
import ImageUploadIcon from "./ImageUploadIcon"
import { updatePhoto } from "../store/slices/user";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Modal, Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


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

export default function PhotoUpload({ 
  setStep, 
}: IProps) {
  const [photoInfos, setPhotoInfos] = useState<PhotoInfo>(initPhotoInfo());
  const dispatch = useDispatch<AppDispatch>();

  const setIthPhoto = useCallback((file: File) => {
    const newPhoto = { file, src: URL.createObjectURL(file) };
    console.log(newPhoto.src);
    setPhotoInfos(newPhoto);
  }, [photoInfos, setPhotoInfos]);


  const confirmOnClick = useCallback(() => {
    dispatch(updatePhoto(photoInfos.src));
    setStep(1);
  }, [photoInfos, setStep]);
  
  return (
    <section className={""}>
        <div className={"flex flex-row items-center ml-12  mt-10 my-32"}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }}/>
                <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
                    CryptoCard
                </h1>
         </div>
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
        ※ 얼굴을 정중앙에 위치시켜 주세요. 
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

