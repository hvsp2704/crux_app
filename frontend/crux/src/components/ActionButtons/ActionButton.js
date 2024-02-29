import React,{useState} from 'react';
import './ActionButton.css';
import RoleModal from '../RoleModal/RoleModal';
function ActionButton() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  return (


        
        <div className='buttons-row'>
          <button className='cancel'>Cancel</button>
          <button onClick={() => setIsRoleModalOpen(true)} className='attach'>Attach files</button>
          <RoleModal
            isOpen={isRoleModalOpen}
            onRequestClose={() => setIsRoleModalOpen(false)}
          />
        </div>


    
  );
}

export default ActionButton;


