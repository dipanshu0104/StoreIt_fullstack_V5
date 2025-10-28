"use client";

import { useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import { motion } from "framer-motion";
import axios from "axios";
import useFileStore from "../../store/fileStore";
import UploadProgressBar from "./UploadProgressBar";
import socket from "../../utils/socket"; // assuming your socket setup
import api from "../../utils/api"

const UploadButton = () => {
  const { addUploadingFile, updateUploadingProgress, removeUploadingFile } = useFileStore();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (!selectedFiles.length) return;

    setUploading(true);

    for (const file of selectedFiles) {
      const formData = new FormData();
      formData.append("files", file);

      const fileInfo = { filename: file.name, progress: 0 };
      addUploadingFile(fileInfo);

      try {
        await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / event.total);
            updateUploadingProgress(file.name, progress);
          },
        });

        // After successful upload
        removeUploadingFile(file.name);
        socket.emit("file:list:updated");

      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        removeUploadingFile(file.name);
      }
    }

    setUploading(false);
    event.target.value = ""; // reset input
  };

  return (
    <div className="relative">
      <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
        <MdCloudUpload size={20} />
        <span className="md:block hidden">Upload</span>
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* Attach progress bar to the upload button */}
      <UploadProgressBar />
    </div>
  );
};

export default UploadButton;
