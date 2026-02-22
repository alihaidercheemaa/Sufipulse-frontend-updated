'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVocalistProfile } from '@/services/vocalist';
import Cookies from 'js-cookie';
import VocalistProfile from '@/components/pages/VocalistProfile';
import EditVocalistProfile from '@/components/pages/EditVocalistProfile';
import { Mic } from 'lucide-react';

const VocalistProfilePage = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Check if profile exists on component mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = parseInt(Cookies.get('user_id') || '0');
        if (userId) {
          const response = await getVocalistProfile(userId);
          if (response.status === 200 && response.data) {
            setProfileExists(true);
            setIsEditing(false);
          } else {
            setProfileExists(false);
            setIsEditing(true);
          }
        } else {
          setProfileExists(false);
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setProfileExists(false);
        setIsEditing(true);
      }
    };

    checkProfile();
  }, []);

  const handleRegistrationComplete = () => {
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // If profile exists and user is not editing, show the display component
  if (profileExists && !isEditing) {
    return <VocalistProfile onEditClick={handleEditClick} />;
  }

  // Otherwise, show the form
  return (
    <EditVocalistProfile 
      onRegistrationComplete={handleRegistrationComplete} 
      onCancel={handleCancelEdit} 
      isEditing={isEditing} 
    />
  );
};

export default VocalistProfilePage;
