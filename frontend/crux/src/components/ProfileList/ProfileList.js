import React from 'react';
import ProfileListItem from './ProfileListItem';
import './ProfileList.css';


function ProfileList({ profiles}) {

  if (!Array.isArray(profiles)) {
    console.error('Profiles is not an array:', profiles);
    return null; // or display an error message or loading indicator
  }
 
  return (
    <div className=" overflow-scroll profileList w-100">
        {
            profiles.map(profile => (
            <ProfileListItem key={profile.id} profile={profile} />
            ))
        }
    </div>
  );
}

export default ProfileList;