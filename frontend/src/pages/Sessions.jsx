import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { formatDate } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from "../components/modals/ConfirmationModal"

const SessionsPage = () => {
  const {
    allSessions,
    getSessions,
    terminateSession,
    user,
  } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  useEffect(() => {
    getSessions(); // Initial fetch

    const interval = setInterval(() => {
      getSessions();
    }, 1000); // Auto refresh every 1 second

    return () => clearInterval(interval); // Cleanup
  }, [getSessions]);

  const handleTerminate = (sessionId) => {
    setSelectedSessionId(sessionId);
    setShowModal(true);
  };

  const handleConfirmTerminate = async (sessionId) => {
    await terminateSession(sessionId);
  };

  return (
    <div className="max-w-full mx-auto max-h-full h-full md:mt-0 mt-15 rounded-2xl bg-gray-950 px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl text-white sm:text-3xl font-bold mb-6">
        Active Sessions
      </h1>

      {allSessions.length === 0 ? (
        <div className="text-gray-500">No active sessions.</div>
      ) : (
        <ul className="space-y-4">
          <AnimatePresence>
            {allSessions.map((session) => (
              <motion.li
                key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
                className={`p-4 border rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  session.isCurrent ? 'bg-gray-900 border-green-400' : 'bg-gray-900'
                }`}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white text-lg">{session.device}</p>
                  <p className="text-sm text-gray-600">OS: {session.os}</p>
                  <p className="text-sm text-gray-600">Browser: {session.browser}</p>
                  <p className="text-sm text-gray-600">IP: {session.ipAddress}</p>
                  <p className="text-sm text-gray-500">
                    Created: {formatDate(session.createdAt)}
                  </p>
                  {session.isCurrent && (
                    <span className="text-xs text-green-600 font-semibold">
                      (This device)
                    </span>
                  )}
                </div>

                {!session.isCurrent && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTerminate(session.sessionId)}
                    className="self-start sm:self-auto px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Terminate
                  </motion.button>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      <ConfirmationModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmTerminate}
        sessionId={selectedSessionId}
      />
    </div>
  );
};

export default SessionsPage;
