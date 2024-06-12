import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from "react-redux";
import { cosine_sim, selectUser } from "../store/slices/user";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router";
import CryptoCard from "./CryptoCard";

export interface IProps {
    setStep: Dispatch<SetStateAction<number>>;
    setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Loading({setStep, 
    setModalOpen,
    } : IProps) {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const photo = useSelector(selectUser).image;
    const id = useSelector(selectUser).idcard;

    const [loading, setLoading] = useState<boolean>(false);

    

    useEffect(() => {
        const data = {
            photo: photo,
            id: id
        }
        if(typeof photo === null || typeof id === null){
            setModalOpen(true);
            setStep(0);
        }
        else{
            // prevent duplicated request by using loading state
            setLoading((prevLoading: boolean) => {
                if (prevLoading === true) return true;
                dispatch(cosine_sim(data)).then((response) => {
                    if (response.payload == null){
                        setModalOpen(true);
                        setStep(0);
                    }
                    else{
                        if(typeof response.payload == 'number' && response.payload < 0.95){
                            setModalOpen(true);
                            setStep(0);
                        }
                        else{
                            navigate("/account");
                        }
                    }
                    setLoading(false);
                })
                return true;
            });
        }
    }, [setModalOpen, setStep]);

    return (
        <section className={""}>
            <CryptoCard setStep={setStep} />
            <div className={"flex-1 flex flex-col justify-center items-center"}>
                <CircularProgress size={80} />
                <h2 className={"text-center text-2xl text-black font-bold mt-20 my-10"}>
                    인증이 진행중입니다.
                </h2>
            </div>
        </section>
    );
};

