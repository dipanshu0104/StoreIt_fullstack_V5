import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate, formatSize } from "../../utils/formatters";
import '../../index.css';

const InfoModal = ({ file, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="relative bg-gray-900 p-6 rounded-lg shadow-lg sm:max-w-md max-w-[90%] w-full"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <AiOutlineClose size={18} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-white">File Info</h2>
        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Size:</strong> {formatSize(file.size)}</p>
          <p><strong>Date:</strong> {formatDate(file.date)}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InfoModal;
