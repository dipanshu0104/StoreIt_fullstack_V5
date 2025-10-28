import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import UserAvatarUpload from '../components/usersection/UserAvatarUpload';
import { useAuthStore } from '../store/authStore'; // adjust path if needed
import axios from 'axios';

export default function Settings() {
  const { user, isLoading, setUser } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    isVerified: false,
    lastLogin: '',
    createdAt: '',
    updatedAt: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [updateStatus, setUpdateStatus] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        isVerified: user.isVerified || false,
        lastLogin: user.lastLogin || '',
        createdAt: user.createdAt || '',
        updatedAt: user.updatedAt || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'password' || name === 'confirmPassword') {
        setPasswordError(
          updated.confirmPassword && updated.password !== updated.confirmPassword
            ? 'Passwords do not match'
            : ''
        );
      }
      return updated;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      setUpdateStatus(null);
      const { fullName, password } = formData;
      const payload = { fullName };
      if (password) payload.password = password;

      const res = await axios.put('http://localhost:5000/api/update-profile', payload, {
        withCredentials: true,
      });

      setUser(res.data.user); // update Zustand store
      setFormData((prev) => ({
        ...prev,
        password: '',
        confirmPassword: '',
        updatedAt: res.data.user.updatedAt || new Date().toISOString(),
      }));
      setUpdateStatus('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setUpdateStatus(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <motion.div
      className="w-full p-4 sm:p-6 md:p-10 text-white bg-gray-950 rounded-2xl md:mt-0 mt-15"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Account Settings</h2>

      <div className="flex items-center mb-8">
        <UserAvatarUpload />
        <div className="ml-4 text-lg">{formData.fullName}</div>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleUpdate}>
        {/* Full Name */}
        <div>
          <label className="block mb-2 text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70"
          />
        </div>

        {/* Passwords */}
        <div className="md:col-span-2">
          <label className="block mb-2 text-sm font-medium">Password</label>
          <div className="flex gap-4">
            <div className="relative w-1/2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>

            <div className="relative w-1/2">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`w-full p-3 rounded-md focus:outline-none focus:ring-2 pr-10 ${
                  formData.confirmPassword
                    ? formData.password === formData.confirmPassword
                      ? 'bg-green-900 text-white focus:ring-green-500'
                      : 'bg-red-900 text-white focus:ring-red-500'
                    : 'bg-gray-800 text-white focus:ring-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>
          {passwordError && <p className="text-red-500 mt-2 text-sm">{passwordError}</p>}
        </div>

        {/* Read-only fields */}
        <div>
          <label className="block mb-2 text-sm font-medium">Verified</label>
          <input
            type="text"
            value={formData.isVerified ? 'Yes' : 'No'}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Last Login</label>
          <input
            type="text"
            value={formData.lastLogin ? new Date(formData.lastLogin).toLocaleString() : ''}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Created At</label>
          <input
            type="text"
            value={formData.createdAt ? new Date(formData.createdAt).toLocaleString() : ''}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">Updated At</label>
          <input
            type="text"
            value={formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : ''}
            readOnly
            className="w-full p-3 bg-gray-700 text-white rounded-md cursor-not-allowed opacity-70"
          />
        </div>
      </form>

      <div className="flex justify-end gap-4 mt-10">
        <button
          type="button"
          className="px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              fullName: user?.fullName || '',
              password: '',
              confirmPassword: '',
            }));
            setPasswordError('');
            setUpdateStatus(null);
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleUpdate}
          disabled={isLoading}
          className={`px-5 py-2 rounded-md transition ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
          }`}
        >
          {isLoading ? 'Updating...' : 'Update'}
        </button>
      </div>

      {updateStatus && (
        <p className={`mt-4 text-sm ${updateStatus.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
          {updateStatus}
        </p>
      )}
    </motion.div>
  );
}
