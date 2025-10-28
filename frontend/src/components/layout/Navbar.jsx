import { useState, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiSettings, FiLogOut } from "react-icons/fi";
import UploadButton from "../minorcomp/UploadButton";
import SearchBar from "../minorcomp/SearchBar";
import { motion } from "framer-motion";
import { useClickAway } from "react-use";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useClickAway(dropdownRef, () => setDropdownOpen(false));

  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center md:static fixed z-20 w-full">
      <h1></h1>
      <div className="flex items-center gap-4">
        <SearchBar />
        <UploadButton />

        {/* User Profile Icon */}
        <div className="relative user-menu" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <FaUserCircle size={24} />
            <span>{user.name}</span>
          </button>

          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0.8 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0.8 }}
              className="absolute border border-gray-700 right-0 mt-2 w-30 bg-gray-800 text-white rounded-lg shadow-lg origin-top"
            >
              <ul>
                <Link
                  to="/user/settings"
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-500 rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                  <FiSettings />
                  <span>Settings</span>
                </Link>
                <li
                  onClick={() => {
                    logout();
                  }}
                  className="flex items-center gap-2 px-3 py-2 transition-all duration-500 rounded-lg hover:bg-gray-700 cursor-pointer"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
