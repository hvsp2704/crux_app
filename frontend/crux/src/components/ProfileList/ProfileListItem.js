import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import { createTheme } from '@mui/material';
import ProfileModal from '../RoleModal/ProfileModal';
import './ProfileListItem.css';
import axios from 'axios';

function ProfileListItem({ profile }) {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [details,setDetails] = useState({});
    const getInitials = (name) => name.split(' ').map((n) => n[0]).join('');
    const key = profile.id;

    const avatar_color = createTheme({
        palette: {
            primary: {
                main: '#F2F4F7',
            }
        },
    });

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
      if(isProfileModalOpen){
        addClassToElement('root','blur')
      }else{
        removeClassFromElement('root','blur')
      }
    },)
  
    const handleViewDetails = async () => {
      
      try {
        console.log(`ID:${key}`);
        const response = await axios.get(`http://127.0.0.1:8000/api/details/?id=${key}`);
        const profile_data = response.data;
        setDetails(profile_data);
        console.log(profile_data);
      } catch (error) {
        console.log(error);
      }
    }
    // Function to toggle the profile modal state
    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);

    };

    return (
        <div className="profileItem w-100 bg-white">
            <div className='profileItem-Name'>
                <Avatar sx={{ bgcolor: avatar_color.primary }} className='profileItem-Name-Avatar'>{getInitials(profile.name)}</Avatar>
                <div className='profileItem-Name-Text'>
                    <div className='profileItem-Name-Text-1'>{profile.name}</div>
                    <div className='profileItem-Name-Text-2'>{profile.email}</div>
                </div>
            </div>
            <div className='profileItem-RelevanceScore'>{profile.relevance_score}</div>
            <div className='profileItem-Resume d-flex flex-row' id={key}>
                <div className='ProfileItem-Resume-Link'>
                    <a href={`http://127.0.0.1:8000/api/download/?id=${profile.id}`}>
                        <button className='ProfileItem-Resume-Link-Button'>Link</button>
                    </a>
                </div>
                <div className='profileItem-Resume-Details'>
                    <button onClick={ async (profile)=>{
                      await handleViewDetails(profile);
                      toggleProfileModal();
                    }} className='profileItem-Resume-Details-Button bg-white'> View Details</button>
                </div>
            </div>
            <ProfileModal
                isOpen={isProfileModalOpen}
                onRequestClose={toggleProfileModal}
                profile={details} // Pass the profile data to the modal if needed
            />
        </div>
    );
}

export default ProfileListItem;
