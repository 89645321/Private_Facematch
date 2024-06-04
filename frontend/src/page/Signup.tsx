import React, {useRef, useState, useEffect, useCallback,} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import axios from "axios";
import style from "../constant/style";
import { AppDispatch } from '../store';
import { getKey, selectUser, updateResults, enc } from '../store/slices/user';
import { useNavigate } from "react-router";
import CreditCardIcon from '@mui/icons-material/CreditCard';


export default function SignUp() {
    const [id, setID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const passwordInput = useRef<HTMLInputElement>(null);
    const image = useSelector(selectUser).image;
    const loginUser = useSelector(selectUser).loginUser;
    const navigate = useNavigate();
    const backendUrl = '';

    useEffect(() => {
        if (loginUser) {
            navigate("/upload");
        }
    }, [navigate, loginUser]);

    const signuphandler = useCallback(async () => {
        await axios.post(`${backendUrl}/user/signup/`, {
            identification: id,
            password: password,
            name: name
        });
        navigate("/login");
    }, [navigate, id, password, name]);


    return (
        <section className={style.page.base}>
            <div className={"flex flex-row items-center ml-12  mt-10 my-32"}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }}/>
                <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
                    CryptoCard
                </h1>
            </div>
            <div className={"flex-1 flex flex-col justify-center items-center"}>
                <div className={"box-border h-96 w-3/5 border-2 justify-center items-center"}>
                    <h2 className={"text-center text-5xl text-indigo-800 font-bold mt-10 my-10"}>
                        Sign-up
                    </h2>
                    <div className={"flex flex-row w-full justify-center"}>
                        <TextField
                            sx={{
                            maxWidth: 280,
                            minWidth: 240,
                            width: "75%",
                            }}
                        label={"ID"}
                        size={"small"}
                        variant={"outlined"}
                        value={id}
                        onChange={(e) => {
                            setID(e.target.value);
                        }}
                        onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            passwordInput.current?.focus();
                        }
                        }}
                        required
                        />
                    </div>
                    <div className={"flex flex-row w-full justify-center mt-4"}>
                        <TextField
                            sx={{
                            maxWidth: 280,
                            minWidth: 240,
                            width: "75%",
                            }}
                        size={"small"}
                        placeholder={"비밀번호"}
                        type={"password"}
                        variant={"outlined"}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            passwordInput.current?.focus();
                        }
                        }}
                        required
                        />
                    </div>
                    <div className={"flex flex-row w-full justify-center mt-4 my-6"}>
                        <TextField
                            sx={{
                            maxWidth: 280,
                            minWidth: 240,
                            width: "75%",
                            }}
                        size={"small"}
                        placeholder={"이름"}
                        variant={"outlined"}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        onKeyUp={(e) => {
                        if (e.key === "Enter") {
                            passwordInput.current?.focus();
                        }
                        }}
                        required
                        />
                    </div>
                    <div className={"flex flex-row w-full justify-center"}>
                        <button
                            className={"w-48 min-h-8 h-8 rounded-md bg-indigo-800 text-center text-white justify-center"}
                            disabled={!id || !password || !name}
                            onClick={signuphandler}
                            >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}