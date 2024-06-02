import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useDispatch, useSelector } from "react-redux";
import { cosine_sim, selectUser } from "../store/slices/user";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router";


export interface IProps {
    setStep: Dispatch<SetStateAction<number>>;
}

const Loading = ({setStep} : IProps) => {
    const key = useSelector(selectUser).key;
    const photo = useSelector(selectUser).image;
    const id = useSelector(selectUser).idcard;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        const data = {
            photo: photo,
            id: id,
            key: key
        }
        dispatch(cosine_sim(data)).then((response) => {
            if (response.payload == null){
                setStep(0);
            }
            else{
                navigate("/account");
            }
        })
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
