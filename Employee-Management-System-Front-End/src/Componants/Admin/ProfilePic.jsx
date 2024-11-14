import React from 'react';
import maleImage from '@/assets/male-Profile.png'; // Replace with the actual path
import femaleImage from '@/assets/female-Profile.png';

const ProfilePic = ({ gender }) => {
  const profileImage = gender === 'Male' ? maleImage : femaleImage;

  return (
    <img
      src={profileImage}
      alt="Profile"
      style={{
        width: '100px',
        height: '100px',
        objectFit: 'cover',
        borderRadius: '50%',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Subtle shadow effect
        display: 'block', // Centers the image if needed
        margin: '0 auto', // Centers the image horizontally
      }}
    />
  );
};

export default ProfilePic;