import React from 'react';
import UploadedFileItem from './UploadedFileItem';


function UploadedFileList({ files }) {
  return (

    <div class="filequeue overflow-scroll  d-flex flex-column align-items-start" style={{ maxHeight:'50vh',width:'30%', gap:"12px" }}>
      
        {files.map(file => (
          <div class="queueitem d-flex" style={{
            padding: '15px',
            paddingLeft: '20px',
            width: '100%',
            height: '72px',
            background: '#FFFFFF',
            border: '1px solid #EAECF0',
            borderRadius: '12px'
          }}>
          <UploadedFileItem key={file.name} file={file} />
          </div>
        ))}
      
    </div>

    
  );
}

export default UploadedFileList;