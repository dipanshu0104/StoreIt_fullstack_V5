import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import api from "../../utils/api";
import socket from "../../utils/socket";
import useFileStore from "../../store/fileStore";
import toast from "react-hot-toast";
import "../../index.css";

const DeleteModal = ({ file, onClose }) => {
  const modalRef = useRef(null);

  const files = useFileStore((state) => state.files);
  const setFiles = useFileStore((state) => state.setFiles);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDelete = async () => {
    try {
      await api.delete(`/file/${encodeURIComponent(file.name)}`);

      const updatedFiles = files.filter((f) => f.filename !== file.name);
      setFiles(updatedFiles);

      // Optional: Emit file delete event
      socket.emit('file:deleted', { filename: file.name });

      toast.success(`File deleted successfully.`);
      onClose();
    } catch (error) {
      console.error("Failed to delete file:", error);
      toast.error(`Failed to delete file.`);
    }
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="relative bg-gray-900 p-6 rounded-lg shadow-lg sm:max-w-sm max-w-[90%] w-full"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        {/* Cancel Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <AiOutlineClose size={18} />
        </button>

        <h2 className="text-md font-semibold mb-4 text-white mt-3">
          Are you sure you want to delete <span className="font-bold">{file.name}</span>?
        </h2>

        <div className="flex justify-end space-x-4">
          <button
            onClick={handleDelete}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded transition-all duration-300 hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteModal;
