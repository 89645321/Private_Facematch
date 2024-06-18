import React, { Dispatch, SetStateAction } from "react";
import CreditCardIcon from '@mui/icons-material/CreditCard';

interface IProps {
  setStep: Dispatch<SetStateAction<number>>;
}

export default function CryptoCard({
    setStep
  }: IProps) {

    const initialize = () => {
        setStep(0);
    };

    return (
        <div className={"flex flex-row items-center ml-12  mt-10 my-32"} onClick={initialize} style={{cursor: 'pointer'}}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }}/>
                <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
                    CryptoCard
                </h1>
        </div>
    )
};