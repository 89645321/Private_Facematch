import React, {useRef, useState} from 'react';
import { TextField } from "@mui/material";
import style from "../constant/style";


export default function LogIn() {
    const [id, setID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const passwordInput = useRef<HTMLInputElement>(null);


    return (
        <section className={style.page.base}>
            <h1 className={"text-left text-6xl text-indigo-800 font-bold ml-24 mt-10 my-32"}>
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
                            className={"w-48 min-h-8 h-8 rounded-md bg-indigo-800 text-center text-white justify-center"}
                            disabled={!id || !password}
                            >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}