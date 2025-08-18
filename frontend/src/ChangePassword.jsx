import React, { useState } from 'react';
import axios from 'axios';

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        '/api/auth/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Error changing password'
      );
    }
    setLoading(false);
  };

  return (
  <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      <div className="mb-2">
        <label className="block mb-1">Current Password</label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute right-2 top-2 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 rounded px-2 py-1 focus:outline-none"
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="mb-2">
        <label className="block mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-2 top-2 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 rounded px-2 py-1 focus:outline-none"
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="mb-2">
        <label className="block mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-2 top-2 text-xs bg-indigo-100 text-indigo-700 hover:bg-indigo-200 hover:text-indigo-900 rounded px-2 py-1 focus:outline-none"
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        disabled={loading}
      >
        {loading ? 'Changing...' : 'Change Password'}
      </button>
      {message && <div className="mt-3 text-red-600">{message}</div>}
    </form>
  );
}
