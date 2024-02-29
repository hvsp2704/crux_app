import React, {useState, useEffect} from 'react';
import { useDropzone } from 'react-dropzone';
import './UploadBox.css';
import UploadedFileList from './UploadedFileList';
import RoleModal from '../RoleModal/RoleModal';


function UploadBox() {

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isRoleModalOpen,setIsRoleModalOpen] = useState(false);

  function addClassToElement(elementId, className) {
    // Find the element by its ID
    var element = document.getElementById(elementId);
    
    // Check if the element exists
    if (element) {
        // Add the class to the element
        element.classList.add(className);
    } else {
        console.error("Element with ID '" + elementId + "' not found.");
    }
  }
  function removeClassFromElement(elementId, className) {
    // Find the element by its ID
    var element = document.getElementById(elementId);
    
    // Check if the element exists
    if (element) {
        // Remove the class from the element
        element.classList.remove(className);
    } else {
        console.error("Element with ID '" + elementId + "' not found.");
    }
  }

  useEffect(()=>{
    if(isRoleModalOpen){
      addClassToElement('root','blur')

    }else{
      removeClassFromElement('root','blur')
    }
  },)

  const { getRootProps, getInputProps } = useDropzone({
    // Accept only PDF files
    accept: 'application/pdf',
    onDrop: (acceptedFiles) => {
      // Handle file upload
      setUploadedFiles(acceptedFiles)
      console.log(acceptedFiles);
    },
  });

  return (

      <div className='section' id="blur-two">
        <div className='Upload-row'>
            <div {...getRootProps({ className: 'UploadBox' })}>
              <input {...getInputProps()} />
              <div className='content'>
                <div>
                <img src='/images/upload.png' alt = "..."></img>
                </div>
                <div className='text-box'>
                <div className='upload-button'>Click to upload PDF</div><p className='plain-text'> or drag and drop</p>
                </div>
              </div>
            </div>
        </div>
        <div className='UploadedFiles w-100 mt-3 mb-2 d-flex justify-content-center align-items-center'>

        {
            uploadedFiles.length>0 &&
            <UploadedFileList files={uploadedFiles} />
        }

        </div>

        <div className='ActionButtons w-100'>
          <div className='buttons-row z-1'>
            <button className='cancel'>Cancel</button>
            <button onClick={() => setIsRoleModalOpen(true)} className='attach'>Attach files</button>
            <RoleModal
              isOpen={isRoleModalOpen}
              onRequestClose={() => setIsRoleModalOpen(false)}
              uploadedFiles = {uploadedFiles}
            />
          </div>
        </div>


        
      </div>

    
  );
}

export default UploadBox;