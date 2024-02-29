import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./UploadedFileItem.css"

function UploadedFileItem({ file }) {
  console.log(file);

  // let file = {
  //   name: uploadedfile.name,
  //   size: uploadedfile.size, // example size in KB
  //   uploadedPercentage: uploadedfile.uploadedPercentage // example uploaded percentage
  // };

  return (

      <div className="uploadedfile ">
        <div class="uploadeditem ">
          <div class="pdf-icon ">
            <img src = "/images/FileType.png" alt="pdf"></img>
          </div>
          <div class="file-info ">
          <div class="file-name" >{file.name}</div>
          <div class="file-size" >{file.size} KB -  {`${file.uploadedPercentage}% uploaded`}
          </div>
          </div>
          
        </div>
        
        <div class="file-status">
        
          {file.uploadedPercentage === 100 ? (
            <CheckCircleIcon color="success" />
          ) :(
          <CircularProgress variant="determinate" value={file.uploadedPercentage} />
          )
          }
        </div>
      </div>


  );
}

export default UploadedFileItem;