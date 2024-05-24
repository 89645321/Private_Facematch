import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CreditCardIcon from '@mui/icons-material/CreditCard';


export interface IProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const Loading = ({setStep} : IProps) => {

    useEffect(() => {
        const timer = setTimeout(() => {
            setStep(0);
        }, 5000);
    }, []);
    return (
        <section className={""}>
            <div className={"flex flex-row items-center ml-12  mt-10 my-48"}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }}/>
                <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
                    CryptoCard
                </h1>
            </div>
            <div className={"flex-1 flex flex-col justify-center items-center"}>
                <CircularProgress size={80} />
                <h2 className={"text-center text-2xl text-black font-bold mt-20 my-10"}>
                    인증이 진행중입니다.
                </h2>
            </div>
        </section>
    );
};

export default Loading;
