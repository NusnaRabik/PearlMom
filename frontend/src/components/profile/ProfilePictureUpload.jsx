// frontend/src/components/profile/ProfilePictureUpload.jsx
import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Check, X } from 'lucide-react';

const ProfilePictureUpload = ({ currentImage, onUpload, onRemove, size = 'lg' }) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(currentImage || null);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  const iconSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setUploadSuccess(true);
        onUpload?.(file, reader.result);
        setTimeout(() => setUploadSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitials = () => {
    // This would typically come from user data
    return 'U';
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Profile Picture */}
      <div
        className={`${sizeClasses[size]} relative rounded-full overflow-hidden cursor-pointer group`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Image or Placeholder */}
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center">
            <span className={`${iconSizeClasses[size]} font-semibold text-white`}>
              {getInitials()}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}>
          <Camera size={size === 'sm' || size === 'md' ? 16 : 20} className="text-white" />
        </div>

        {/* Upload Success Badge */}
        {uploadSuccess && (
          <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-1 px-3 py-1.5 bg-pink-600 text-white rounded-lg text-xs font-medium hover:bg-pink-700 transition-colors"
        >
          <Upload size={14} />
          <span>{preview ? 'Change' : 'Upload'}</span>
        </button>
        {preview && (
          <button
            onClick={handleRemove}
            className="flex items-center space-x-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors"
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Guidelines */}
      <p className="text-xs text-gray-400 text-center">
        Recommended: 400x400px<br />
        Max size: 5MB
      </p>
    </div>
  );
};

export default ProfilePictureUpload;