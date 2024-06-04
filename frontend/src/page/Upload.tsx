import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PhotoUpload from "../component/PhotoUpload";
import IDCardUpload from "../component/IDCardUpload";
import Loading from "../component/Loading";
import { selectUser } from "../store/slices/user";


export default function Upload() {
    const [step, setStep] = useState<number>(0);

    const getPage = useCallback((step: number): JSX.Element => {
        switch (step) {
        case 0:
            return <PhotoUpload
                setStep={setStep}
            />;
        case 1:
            return <IDCardUpload
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