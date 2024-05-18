import React, { ChangeEvent, useCallback, useRef } from "react";


export interface IProps {
  src: string;
  setIthPhoto: (arr: File) => void;
}

export default function ImageUploadIcon({
  src,
  setIthPhoto,
}: IProps) {
    const uploadRef = useRef<HTMLInputElement | null>(null);

    const imageOnChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
        const inputFiles = event.target.files;
        const uploaded = inputFiles ? inputFiles[0] : null;

        if (uploaded) {
            setIthPhoto(uploaded);
          }
  }, [setIthPhoto]);

  const imageOnClick = useCallback(() => {
    uploadRef.current?.click();
  }, []);

  return (
    <div className={"flex-1 flex flex-col justify-center items-center"}>
      <input
        ref={uploadRef}
        className={"hidden"}
        placeholder={"photo"}
        type="file"
        accept="image/*"
        onChange={imageOnChange}
      />
      <button
        className={"w-fit h-fit"}
        onClick={imageOnClick}
      >
        <img
          className={"h-64 w-96 border-solid border-b-4 border-l-2 border-r-2 rounded-md"}
          src={src}
          alt=""
        />
      </button>
    </div>
  );
}