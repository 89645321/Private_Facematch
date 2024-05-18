import React, {useRef, useState, useCallback,} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import style from "../constant/style";
import { AppDispatch } from '../store';
import { getKey, selectUser, updateResults, enc } from '../store/slices/user';
import { useNavigate } from "react-router";


export default function LogIn() {
    const [id, setID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const dispatch = useDispatch<AppDispatch>();
    const passwordInput = useRef<HTMLInputElement>(null);
    const image = useSelector(selectUser).image;
    const navigate = useNavigate();


    const loginhandler = useCallback(() => {
        dispatch(updateResults());
        navigate("/upload");
    }, [dispatch]);

    const signinhandler = useCallback(() => {
        navigate("/signup");
    }, [dispatch]);


    return (
        <section className={style.page.base}>
            <h1 className={"text-left text-7xl text-indigo-800 font-bold ml-32 mt-10 my-32"}>
                CryptoCard
            </h1>
            <div className={"flex-1 flex flex-col justify-center items-center"}>
                <div className={"box-border h-80 w-3/5 border-2 justify-center items-center"}>
                    <h2 className={"text-center text-5xl text-indigo-800 font-bold mt-10 my-10"}>
                        Log-in
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
                    <div className={"flex flex-row w-full justify-center mt-4 my-6"}>
                        <TextField
                            sx={{
                            maxWidth: 280,
                            minWidth: 240,
                            width: "75%",
                            }}
                        size={"small"}
                        placeholder={"비밀번호"}
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
                    <div className={"flex flex-row w-full justify-center"}>
                        <button
                            className={"w-32 min-h-8 h-8 mx-2 rounded-md bg-indigo-800 text-center text-white justify-center"}
                            disabled={!id || !password}
                            onClick={loginhandler}
                            >
                            로그인
                        </button>
                        <button
                            className={"w-32 min-h-8 h-8 mx-2 rounded-md bg-indigo-800 text-center text-white justify-center"}
                            onClick={signinhandler}
                            >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}