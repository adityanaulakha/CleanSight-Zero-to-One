import React, { useState } from 'react';
import { User, Camera, Upload } from 'lucide-react';

const ProfilePicture = ({ 
  src, 
  alt = "Profile", 
  size = "md", 
  editable = false, 
  onImageChange,
  className = ""
}) => {
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    "2xl": "w-32 h-32"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5", 
    xl: "w-8 h-8",
    "2xl": "w-12 h-12"
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file || !onImageChange) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;
        onImageChange(base64Image);
        setIsUploading(false);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300`}>
        {!imageError && src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <User className={`${iconSizes[size]} text-gray-400`} />
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}
      </div>
      
      {editable && (
        <div className="absolute bottom-0 right-0">
          <label 
            htmlFor={`profile-upload-${Math.random()}`}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-lg transition-colors"
          >
            <Camera className="w-3 h-3" />
          </label>
          <input
            id={`profile-upload-${Math.random()}`}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
