// components/SessionCard.jsx
import React from 'react';

const SessionCard = ({ session, onLogout }) => {
  return (
    <div className="bg-[#1c2431] p-4 rounded-xl shadow-md mb-4 border border-[#2e3748]">
      <p className="text-white"><span className="font-semibold">Device:</span> {session.device}</p>
      <p className="text-white"><span className="font-semibold">OS:</span> {session.os}</p>
      <p className="text-white"><span className="font-semibold">Browser:</span> {session.browser}</p>
      <p className="text-white"><span className="font-semibold">IP Address:</span> {session.ipAddress}</p>
      <p className="text-white"><span className="font-semibold">Created At:</span> {new Date(session.createdAt).toLocaleString()}</p>
      <button
        className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        onClick={() => onLogout(session.sessionId)}
      >
        Logout
      </button>
    </div>
  );
};

export default SessionCard;
