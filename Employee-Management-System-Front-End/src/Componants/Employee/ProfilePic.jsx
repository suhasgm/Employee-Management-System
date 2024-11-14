import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const ProfilePic = () => {
  const [profilePicUrl, setProfilePicUrl] = useState(null); // State to store the profile picture URL

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1010/adminuser/get-profile-pic', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setProfilePicUrl(response.data.profilePicUrl); // Assuming the backend returns the image URL in this format
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePic(); // Fetch the profile picture on component mount
  }, []);

  return (
    <div className="d-flex flex-column align-items-center">
      <div
        className="bg-secondary rounded-circle mb-2"
        style={{
          width: '100px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {profilePicUrl ? (
          <img
            src={profilePicUrl}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        ) : (
          <FaUserCircle className="text-white" style={{ fontSize: '50px' }} />
        )}
      </div>
    </div>
  );
};

export default ProfilePic;
