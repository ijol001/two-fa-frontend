import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Pages/Layout";
import LogReg from "./Pages/Auth/LogReg";
import  Dashboard  from './Pages//Dashboard';
import { useState } from "react";
import Userregverify from "./Pages/Auth/Userregverify";
import Userloginverify from "./Pages/Auth/Userloginverify";


const App=()=> {
  const setText= useState(0)
  return (
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Layout />} >
      <Route index element={<LogReg />} />
    </Route>
    <Route path='/dashboard' element={<Dashboard />} />
    <Route path='/verifyreg' element={<Userregverify />} />
    <Route path='/verifylogin' element ={<Userloginverify />} />
   </Routes>
   </BrowserRouter>
   </>
  );
}

export default App;
