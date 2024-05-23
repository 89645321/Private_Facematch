import React, {useRef, useState, useCallback, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch, useSelector } from "react-redux";
import { Modal, Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import axios from "axios";


export default function Account() {
    const [name, setName] = useState<string>("???");
    const [balance, setBalance] = useState<number>(348134);
    const [cookies] = useCookies(['sessionid']);
    const [modalOpen, setModalOpen] = useState<boolean>(true);

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

    const handleClose = useCallback(() => {
        setModalOpen(false);
    }, [setModalOpen]);

    useEffect(() => {
        const token = cookies.sessionid;
    
        if (!token) {
          console.error('No session token found');
          return;
        }

        axios.get('/user/userinfo/', {
            params: { token: token }
        }).then(response =>{
            setName(response.data.name);
            setBalance(response.data.balance);
        })
    }, [cookies]);
    
    return (
        <section className={""}>
            <div>
                <Modal
                    open={modalOpen}
                    onClose={handleClose}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <Box sx={style} className={"rounded-md text-center w-4/5 max-w-xs h-8"}>
                    <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        인증에 성공하였습니다.
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                    </Box>
                </Modal>
            </div>
            <h1 className={"text-left text-7xl text-indigo-800 font-bold ml-32 mt-10 my-32"}>
                CryptoCard
            </h1>
            <div className={"flex-1 flex flex-col justify-center items-center"}>
                <div className={"box-border box-decoration-slice bg-gradient-to-b from-black to-indigo-800 h-96 w-2/3 border-2 justify-center items-center"}>
                    <div className={"ml-20 mt-10 my-10"}>
                        <h2 className={"text-left text-5xl text-white font-bold"}>
                            {name}님의 계좌
                        </h2>
                    </div>
                    <div className={"ml-40 mt-20 my-10"}>
                        <h1 className={"text-left text-7xl text-white"}>
                            {balance}원
                        </h1>
                    </div>
                    <div className={"flex w-full justify-end"}>
                        <button className={"w-32 min-h-8 h-8 mr-8 rounded-md bg-white text-center text-black"}>
                            이체
                        </button>
                    </div>
                    <div className={"flex w-full justify-end"}>
                        <button className={"w-32 min-h-8 h-8 mr-8 mt-4 rounded-md bg-white text-center text-black"}>
                            계좌 조회
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}