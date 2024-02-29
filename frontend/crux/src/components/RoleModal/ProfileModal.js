import React from 'react';
import Modal from 'react-modal';
import TabPanel from "./tabPanel"
import './ProfileModal.css';
import { Avatar } from '@mui/material';

Modal.setAppElement('#root');

function ProfileModal({ isOpen, onRequestClose, profile }) {
  console.log(profile);

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
          <Avatar src="/image/noImage.jpg" />
            <div className="modal-textandsupportingtext">
              <span className="modal-header-text">
                <span>{profile.name}</span>
              </span>
              <span className="modal-header-supportingtext">
                <span>{profile.email}</span>
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
      <TabPanel profile = {profile} college = {profile.college} projects = {profile.projects} experiences = {profile.experiences}/>
    </Modal>
  );
}

export default ProfileModal;
