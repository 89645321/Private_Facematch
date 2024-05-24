import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PhotoUpload from "../component/PhotoUpload";
import IDCardUpload from "../component/IDCardUpload";
import Loading from "../component/Loading";


export default function Upload() {
    const [step, setStep] = useState<number>(2);
    const [Photo, setPhoto] = useState<Float64Array | null>(null);
    const [IDcard, setIDCard] = useState<Float64Array | null>(null); 

    const getPage = useCallback((step: number): JSX.Element => {
        switch (step) {
        case 0:
            return <PhotoUpload
                setPhoto={setPhoto}
                setStep={setStep}
            />;
        case 1:
            return <IDCardUpload
                setPhoto={setIDCard}
                setStep={setStep}
            />;
        case 2:
            return <Loading
                setStep={setStep}
            />;
        default:
            return <section/>;
        }
    }, [
    ]);
 
    return getPage(step);
}