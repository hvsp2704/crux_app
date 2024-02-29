import React from 'react';
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Upload/Upload"
import Filtered from "./pages/Filtered/Filtered"
import TabPanel from './components/RoleModal/tabPanel';

function App() {
  return (
    <>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/filtered"    element={<Filtered/>} />
        <Route path = '/tabpanel' element={<TabPanel/>}/>
      </Routes>
    </>
  );
  
  
}

export default App;

