import React, {useRef, useState, useEffect, useCallback,} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import axios from "axios";
import style from "../constant/style";
import { AppDispatch } from '../store';
import { selectUser } from '../store/slices/user';
import { Modal, Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router";
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { backendUrl } from "../store/url";


export default function SignUp() {
    const [id, setID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [name, setName] = useState<string>("");
    const passwordInput = useRef<HTMLInputElement>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const isLogin = useSelector(selectUser).token;
    const navigate = useNavigate();

    useEffect(() => {
        if (isLogin) {
            navigate("/upload");
        }
    }, [navigate, isLogin]);

    const navigateLogin = useCallback(() => {
        navigate("/login");
    }, []);

    const signuphandler = useCallback(async () => {
        if (id.length > 30 || password.length <= 10 || name.length > 100){
            setModalOpen(true);
        }
        else{
            await axios.post(`${backendUrl}/user/signup/`, {
                identification: id,
                password: password,
                name: name
            });
            navigate("/login");
        }
    }, [navigate, id, password, name]);

    const handleClose = useCallback(() => {
        setModalOpen(false);
    }, [setModalOpen]);


    return (
        <section className={""}>
            <div>
                <Modal
                    open={modalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={style} className={"rounded-md text-center w-20 max-w-xs h-8"}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.0rem'}}>
                        회원가입에 실패했습니다.<br />
                        ID, Password, 이름을<br />
                        다시 확인해주세요.
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    </Box>
                </Modal>
            </div>
            <div className={"flex flex-row items-center ml-12  mt-10 my-32"}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }} onClick={navigateLogin}/>
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