import React, {useRef, useEffect, useState, useCallback,} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TextField } from "@mui/material";
import style from "../constant/style";
import paths from "../constant/path";
import { AppDispatch } from '../store';
import { selectUser, fetchLogin } from '../store/slices/user';
import { Modal, Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router";
import CreditCardIcon from '@mui/icons-material/CreditCard';


export default function LogIn() {
    const [id, setID] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const passwordInput = useRef<HTMLInputElement>(null);
    const loginUser = useSelector(selectUser).loginUser;
    const navigate = useNavigate();

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 300,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    useEffect(() => {
        if (loginUser) {
            navigate("/upload");
        }
    }, [navigate, loginUser]);


    const loginhandler = useCallback(() => {
        const loginData = {
            identification: id,
            password: password,
        };
        dispatch(fetchLogin(loginData)).then((response) => {
            if (response.payload === false) {
                setModalOpen(true);
            }
        });
    }, [id, password, dispatch]);

    const signinhandler = useCallback(() => {
        navigate("/signup");
    }, [dispatch]);

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
                    <Box sx={style} className={"rounded-md text-center w-16 max-w-xs h-8"}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        로그인에 실패하였습니다.
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    </Box>
                </Modal>
            </div>
            <div className={"flex flex-row items-center ml-12  mt-10 my-32"}>
                <CreditCardIcon sx={{ fontSize: 60, color: "#3730A3" }}/>
                <h1 className={"text-left text-7xl text-indigo-800 ml-4 font-bold"}>
                    CryptoCard
                </h1>
            </div>
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