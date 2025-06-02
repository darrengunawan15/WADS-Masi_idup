import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateProfile } from '../redux/slices/authSlice';
import authService from '../services/authService';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
      });
      setPreviewImage(user.profilePicture || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setFormData({
        ...formData,
        profilePicture: file,
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Profile Page - Starting profile update...');
    
    // Validate required fields
    if (!formData.name) {
      console.error('Profile Page - Validation error: Name is required');
      toast.error('Name is required');
      return;
    }
    
    // Validate password if changing
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        console.error('Profile Page - Validation error: Current password required');
        toast.error('Current password is required to set a new password');
        return;
      }
      if (formData.newPassword.length < 6) {
        console.error('Profile Page - Validation error: Password too short');
        toast.error('New password must be at least 6 characters long');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        console.error('Profile Page - Validation error: Passwords do not match');
        toast.error('New passwords do not match');
        return;
      }
    }

    try {
      console.log('Profile Page - Preparing form data for submission...');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      
      // Only append password fields if they are provided
      if (formData.currentPassword) {
        formDataToSend.append('currentPassword', formData.currentPassword);
      }
      if (formData.newPassword) {
        formDataToSend.append('newPassword', formData.newPassword);
      }
      
      // Only append profile picture if it's a new file
      if (formData.profilePicture instanceof File) {
        console.log('Profile Page - Adding profile picture to form data');
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      console.log('Profile Page - Sending update request...');
      const result = await dispatch(updateProfile(formDataToSend)).unwrap();
      console.log('Profile Page - Update successful:', result);
      
      // Update the preview image with the new profile picture URL if it was updated
      if (result.profilePicture) {
        console.log('Profile Page - Updating profile picture preview');
        setPreviewImage(result.profilePicture);
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        profilePicture: null
      }));
    } catch (error) {
      console.error('Profile Page - Update failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // Handle specific error cases
      if (error.message.includes('session has expired') || error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        localStorage.removeItem('accessToken'); // Clear invalid token
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      if (error.message.includes('Network error')) {
        toast.error('Network error. Please check your internet connection and try again.');
        return;
      }

      if (error.response?.status === 403) {
        toast.error('You do not have permission to update your profile. Please log in again.');
        localStorage.removeItem('accessToken'); // Clear invalid token
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        return;
      }

      toast.error(error.message || 'Failed to update profile. Please try again.');
    }
  };

  // Separate handler for password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Both current and new password are required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name || user.name); // name is required by backend
      formDataToSend.append('currentPassword', passwordData.currentPassword);
      formDataToSend.append('newPassword', passwordData.newPassword);
      await dispatch(updateProfile(formDataToSend)).unwrap();
      toast.success('Password updated successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setIsChangingPassword(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update password. Please try again.');
    }
  };

  const handleBack = () => {
    switch (user?.role) {
      case 'customer':
        navigate('/dashboard-customer');
        break;
      case 'staff':
        navigate('/dashboard-staff');
        break;
      case 'admin':
        navigate('/dashboard-admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--hotpink)] hover:bg-[var(--roseberry)] focus:outline-none"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-[var(--hotpink)] hover:bg-[var(--roseberry)] focus:outline-none"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-[var(--hotpink)] text-white rounded-full p-2 shadow-lg hover:bg-[var(--roseberry)] focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--blush)] focus:border-[var(--blush)] sm:text-sm disabled:bg-gray-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={user?.email || ''}
                disabled={true}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--blush)] focus:border-[var(--blush)] sm:text-sm bg-gray-50"
              />
              <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
            </div>

            {isEditing && (
              <div className="flex justify-between gap-4 mt-6 items-center">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword((prev) => !prev)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ${isChangingPassword ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'text-white bg-[var(--hotpink)] hover:bg-[var(--roseberry)] focus:outline-none'}`}
                  disabled={isChangingPassword}
                >
                  Change Password
                </button>
                <div className="flex gap-4 ml-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsChangingPassword(false);
                      setFormData({
                        ...formData,
                        name: user.name || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                        profilePicture: null
                      });
                      setPreviewImage(user.profilePicture || null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-[var(--hotpink)] hover:bg-[var(--roseberry)] rounded-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </form>

          {isChangingPassword && (
            <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--blush)] focus:border-[var(--blush)] sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--blush)] focus:border-[var(--blush)] sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[var(--blush)] focus:border-[var(--blush)] sm:text-sm"
                  required
                />
              </div>
              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-[var(--hotpink)] text-white rounded-md hover:bg-[var(--roseberry)] focus:outline-none"
                >
                  Save Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 