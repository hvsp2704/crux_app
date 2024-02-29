import React, { useState } from 'react';
import Modal from 'react-modal';
import { TextField, MenuItem } from '@mui/material';
import './RoleModal.css';
import axios from 'axios';


Modal.setAppElement('#root');

function RoleModal({ isOpen, onRequestClose, uploadedFiles }) {
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const roles = [
    { value: 'full_stack_developer', label: 'Full Stack Developer' },
    { value: 'front_end_developer', label: 'Front End Developer' },
    { value: 'back_end_developer', label: 'Back End Developer' },
    // Add other roles here...
  ];
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('job_role', role);
      formData.append('job_description', jobDescription);
      uploadedFiles.forEach((file) => {
          formData.append(`files`, file);
      });
      setRole(''); // Reset role state to empty string
      setJobDescription(''); // Reset jobDescription state to empty string

      removeClassFromElement('loading','hidden-element')
      addClassToElement('roleModalHeader','blur')
      addClassToElement('roleModalForm','blur')
      addClassToElement('roleModalButtons','blur')
      const response = await axios.post("http://127.0.0.1:8000/api/", formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      removeClassFromElement('roleModalHeader','blur')
      removeClassFromElement('roleModalButtons','blur')
      removeClassFromElement('roleModaForml','blur')
      addClassToElement('loading','hidden-element')

      const responseData = response.data;
      console.log(responseData)
      localStorage.setItem('responseData', JSON.stringify(responseData));
      window.location.href = '/filtered';
      

      onRequestClose();
    } catch (error) {
        // Handle any errors that occur during the request or redirection
        console.error('Error:', error);
    }
  };

  return (    
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Role"
      className="role-modal p-0 rounded-2"
      overlayClassName="role-modal-overlay"
      id='roleModal'
    >
      <div className="Modalheader" id="roleModalHeader">
          <div className="modal-header-content">
            <img
              src="/images/Flag.png"
              className='Flag'
              alt="flag-icon"
            />
            <div className="modal-textandsupportingtext">
              <span className="modal-header-text">
                <span>Add Role</span>
              </span>
              <span className="modal-header-supportingtext">
                <span>Add the job description</span>
              </span>
          </div>
        </div>
        <button onClick={onRequestClose} className='modal-close-button bg-white'>
        <img
          src="/images/CloseButton.png"
          alt="xcloseI198"
        />
        </button>
        <div className="modal-paddingbottom"></div>
      </div>
      <button class="load hidden-element bg-white" id="loading"></button>
      <form onSubmit={handleSubmit} className="role-form" id="roleModalForm">
        <div className='row-one px-4'>
          <label for="Role" class="modal-field-label">Role*</label>
          <TextField
            select
            id="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            fullWidth
            margin="normal"
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className='row-one px-4' >
          <label for="Description" class="modal-field-label">Job Description*</label>
          <TextField
          id="Description"
          multiline
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="e.g. I joined Crux's Customer Success team to help them scale their checkout product. I focused mainly on onboarding new customers and resolving complaints."
          required
          fullWidth
          margin="normal"
          />
        </div>
        
        <div className="role-modal-action-buttons pt-2" id="roleModalButtons">
          <button onClick={onRequestClose} className='cancel-button'>Cancel</button>
          <button type="submit" className='submit-button'>Submit</button>
        </div>
      </form>

    </Modal>
    
  );
}

export default RoleModal;