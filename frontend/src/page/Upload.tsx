import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import style from "../constant/style";
import PhotoUpload from "../component/PhotoUpload";
import PhotoUploadWeb from "../component/PhotoUploadWeb";
import IDCardUpload from "../component/IDCardUpload";
import Loading from "../component/Loading";
import { selectUser } from "../store/slices/user";
import { Modal, Box, IconButton, Typography} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { setSelectionRange } from "@testing-library/user-event/dist/utils";


export default function Upload() {
    const [step, setStep] = useState<number>(0);
    const [modal, setModal] = useState<boolean>(false);
    const isLogin = useSelector(selectUser).token;
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLogin) {
            navigate("/login");
        }
    }, [navigate, isLogin]);

    const handleClose = useCallback(() => {
        setModal(false);
    }, [setModal]);

    const getPage = useCallback((tep: number): JSX.Element => {
        switch (step) {
        case 0:
            return (
                <section className={""}>
                    <Modal
                        open={modal}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <Box sx={style} className={"rounded-md text-center w-16 max-w-xs h-8"}>
                        <Typography id="modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold', fontSize: '1.0rem'}}>
                            인증에 실패하였습니다.
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        </Box>
                    </Modal>
                    <PhotoUploadWeb
                        setStep={setStep}
                    />;
                </section>
            );
        case 1:
            return <IDCardUpload
                setStep={setStep}
            />;
        case 2:
            return <Loading
                setModalOpen={setModal}
                setStep={setStep}
            />;
        default:
            return <section/>;
        }
    }, [modal, setModal, step, setStep]);
 
    return getPage(step);
}