import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import paths from "./constant/path";
import Account from "./page/Account"
import Upload from "./page/Upload";
import LogIn from "./page/LogIn"
import SignUp from "./page/Signup"
import PhotoUpload from "./component/PhotoUpload"

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path={paths.logIn} element={<LogIn/>}/>
        <Route path={paths.signUp} element={<SignUp/>}/>
        <Route path={paths.photoUpload} element={<Upload/>}/>
        <Route path={paths.account} element={<Account/>}/>
        <Route path={"/*"} element={<Navigate replace to={paths.logIn}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
