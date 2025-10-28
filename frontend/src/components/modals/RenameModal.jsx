import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import '../../index.css';
import socket from "../../utils/socket";
import api from "../../utils/api";
import useFileStore from "../../store/fileStore";
import { toast } from "react-hot-toast";

const RenameModal = ({ file, onClose }) => {
  const modalRef = useRef(null);
  const [newName, setNewName] = useState(file.name);
  const [error, setError] = useState("");
  const { setFiles } = useFileStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!newName.trim()) {
      return setError("New name cannot be empty.");
    }
  
    if (newName === file.name) {
      return setError("New name must be different.");
    }
  
    try {
      await api.put("/rename", {
        currentName: file.name,
        newName,
      });
  
      socket.emit("file-renamed", {
        oldName: file.name,
        newName,
      });
  
      const updatedRes = await api.get("/files");
      const newFiles = updatedRes?.data?.files;
  
      // if (Array.isArray(newFiles)) {
      //   setFiles(newFiles);
      // } else {
      //   console.warn("Unexpected response shape:", updatedRes.data);
      //   toast.error("Failed to refresh file list.");
      // }
  
      toast.success("File renamed successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Rename failed. Please try again");
      setError("Rename failed. Try again.");
    }
  };
  

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="relative bg-gray-900 p-6 rounded-lg shadow-lg sm:max-w-sm max-w-[90%] w-full"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <AiOutlineClose size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-white">Rename File</h2>

        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setError("");
          }}
          className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-white rounded focus:outline-none focus:ring focus:border-blue-500"
          autoFocus
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-blue-600 cursor-pointer"
          >
            Rename
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default RenameModal;
