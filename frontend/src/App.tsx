import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import paths from "./constant/path";
import Account from "./page/Account"
import IDCardUpload from "./page/IDCardUpload"
import LogIn from "./page/LogIn"
import PhotoUpload from "./page/PhotoUpload"

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path={paths.logIn} element={<LogIn/>}/>
        <Route path={paths.photoUpload} element={<PhotoUpload/>}/>
        <Route path={paths.idcardUpload} element={<IDCardUpload/>}/>
        <Route path={paths.account} element={<Account/>}/>
        <Route path={"/*"} element={<Navigate replace to={paths.logIn}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
