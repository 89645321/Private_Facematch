import React, { Dispatch, SetStateAction, useCallback, useState, useRef } from "react";
import Webcam from "react-webcam";
import { updatePhoto } from "../store/slices/user";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Modal, Box, IconButton, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import style from "../constant/style";

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

export default function PhotoUpload({ setStep }: IProps) {
  const [photoInfos, setPhotoInfos] = useState<PhotoInfo>(initPhotoInfo());
  const [modal, setModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const file = dataURLtoFile(imageSrc, "captured_photo.jpg");
      setPhotoInfos({ file, src: imageSrc });
      setCapturedImage(imageSrc); // Save the captured image
    }
  }, [webcamRef, setPhotoInfos]);

  const confirmOnClick = useCallback(() => {
    if (photoInfos.src !== "plus.jpeg") {
      dispatch(updatePhoto(photoInfos.src));
      setStep(1);
    } else {
      setModal(true);
    }
  }, [photoInfos, setStep, dispatch]);

  const handleClose = useCallback(() => {
    setModal(false);
  }, [setModal]);

  const dataURLtoFile = (dataurl: string, filename: string) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)![1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  return (
    <section className={""}>
      <div className={"flex flex-row items-center ml-12 mt-10 my-32"}>
        <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }} />
        <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
          CryptoCard
        </h1>
      </div>
      <h2 className={"text-center text-2xl text-black-800 font-bold mt-10 my-4"}>
        본인 인증
      </h2>
      <section className={"flex-1 flex flex-col justify-center items-center"}>
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" width={320} height={240} />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={320}
            height={240}
          />
        )}
      </section>
      <section className={"flex flex-row w-full justify-center mt-4"}>
        <button
          className={"w-24 min-h-8 h-8 rounded-md bg-indigo-800 text-center text-white justify-center mr-4"}
          onClick={capture}
        >
          촬영
        </button>
        <button
          className={"w-24 min-h-8 h-8 rounded-md bg-indigo-800 text-center text-white justify-center"}
          onClick={confirmOnClick}
        >
          확인
        </button>
      </section>
      {modal && (
        <Modal
          open={modal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          onClose={handleClose}
        >
          <Box sx={style} className={"rounded-md text-center w-16 max-w-xs h-8"}>
            <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.0rem'}}>
              인증에 실패하였습니다.
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
      )}
    </section>
  );
}
