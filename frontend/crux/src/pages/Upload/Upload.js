import React from 'react';
import Navbar from "../../components/Navbar/Navbar"
import UploadBox from "../../components/UploadBox/UploadBox"

function Upload() {


    return (
        <div className={"Upload"} itemID='UploadSection'>
        <Navbar />
        <UploadBox />
        </div>
    );
}

export default Upload;


