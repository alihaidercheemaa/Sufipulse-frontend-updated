'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { submitWriterProfile, getWriterProfile } from '@/services/writer';
import Cookies from 'js-cookie';
import WriterProfileDisplay from '@/components/pages/WriterProfileDisplay';
import EditWriterProfile from '@/components/pages/EditWriterProfile';
import { User, Globe, BookOpen, Calendar, MapPin, ExternalLink, Edit, PenTool, Award, Clock } from 'lucide-react';

const WriterProfilePage = () => {
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  // Check if profile exists on component mount
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const userId = parseInt(Cookies.get('user_id') || '0');
        if (userId) {
          const response = await getWriterProfile(userId);
          if (response.status === 200 && response.data) {
            setProfileExists(true);
            setIsEditing(false); // Default to display view
          } else {
            setProfileExists(false);
            setIsEditing(true); // Show form for new profile
          }
        } else {
          setProfileExists(false);
          setIsEditing(true); // Show form for new profile
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setProfileExists(false);
        setIsEditing(true); // Show form for new profile
      }
    };

    checkProfile();
  }, []);

  const handleRegistrationComplete = () => {
    // After successful registration/update, go back to display mode
    setIsEditing(false);
  };

  const handleEditClick = () => {
    // Switch to edit mode
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Go back to display mode
    setIsEditing(false);
  };

  // If profile exists and user is not editing, show the display component
  if (profileExists && !isEditing) {
    return <WriterProfileDisplay onEditClick={handleEditClick} />;
  }

  // Otherwise, show the form
  return (
    <EditWriterProfile 
      onRegistrationComplete={handleRegistrationComplete} 
      onCancel={handleCancelEdit} 
      isEditing={isEditing} 
    />
  );
};

export default WriterProfilePage;
