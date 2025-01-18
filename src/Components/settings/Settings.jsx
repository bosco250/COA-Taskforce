import React, { useState, useEffect } from 'react';
import { getProfile, updatePassword, updateProfile } from '../api Service/api'; // Import updateProfile
import { useNavigate } from 'react-router-dom';

const Settings = ({ currentUser = { firstName: '', lastName: '', email: '', emailAlerts: false } }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate=useNavigate();
  const [profile, setProfile] = useState({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
  });
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: currentUser.emailAlerts || false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const id = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage
        if (id) {
          const data = await getProfile(id);
          setProfile({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
          });
          setNotifications({
            emailAlerts: data.emailAlerts || false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPassword({ ...password, [field]: value });
  };

  const handleNotificationsChange = (field, value) => {
    setNotifications({ ...notifications, [field]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const id = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage
      if (id) {
        await updateProfile(id, navigate, profile); // Call updateProfile with id and profile
        alert('User profile updated successfully');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (password.newPassword !== password.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
  
    try {
      const id = localStorage.getItem('id'); // Assuming the user ID is stored in localStorage
      if (id) {
        await updatePassword(id, {
          currentPassword: password.currentPassword,
          newPassword: password.newPassword,
        });
        alert('Password updated successfully');
        setPassword({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex border-b mb-6">
        {['profile', 'password', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'text-gray-600 hover:text-blue-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Update Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={profile.firstName}
                onChange={(e) => handleProfileChange('firstName', e.target.value)}
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={profile.lastName}
                onChange={(e) => handleProfileChange('lastName', e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={handleSaveProfile} // Call handleSaveProfile on click
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={password.currentPassword}
                onChange={(e) =>
                  handlePasswordChange('currentPassword', e.target.value)
                }
                placeholder="Enter your current password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={password.newPassword}
                onChange={(e) =>
                  handlePasswordChange('newPassword', e.target.value)
                }
                placeholder="Enter a new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={password.confirmPassword}
                onChange={(e) =>
                  handlePasswordChange('confirmPassword', e.target.value)
                }
                placeholder="Confirm your new password"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Change Password
            </button>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailAlerts"
                className="mr-2"
                checked={notifications.emailAlerts}
                onChange={(e) =>
                  handleNotificationsChange('emailAlerts', e.target.checked)
                }
              />
              <label htmlFor="emailAlerts" className="text-sm text-gray-700">
                Email Alerts
              </label>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
