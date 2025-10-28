import { useRef, useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { FaCamera } from "react-icons/fa6";
import getCroppedImg from '../../utils/cropImageUtils';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserAvatarUpload() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const cropped = await getCroppedImg(image, croppedAreaPixels);
      setCroppedImage(cropped);
      setCropModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  }, [image, croppedAreaPixels]);

  return (
    <div className="relative w-32 h-32">
      {/* Avatar Display */}
      <div className="w-full h-full rounded-full overflow-hidden bg-[#a4c7fc] shadow-md relative z-0">
        <img
          src={croppedImage || "/vite.svg"}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Camera Button */}
      <button
        onClick={() => fileInputRef.current.click()}
        className="absolute bottom-1 right-1 w-8 h-8 bg-[#5b75f9] cursor-pointer rounded-full flex items-center justify-center z-10 shadow-md hover:bg-[#3d56f0] transition"
      >
        <FaCamera className="text-white text-sm" />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Crop Modal with Animation */}
      <AnimatePresence>
        {cropModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-gray-800 border border-gray-700 p-4 rounded-md w-[90vw] max-w-md h-[80vh] flex flex-col"
            >
              <div className="relative flex-1">
                <Cropper
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-between items-center gap-2">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="w-full"
                />
                <button
                  onClick={showCroppedImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setCropModalOpen(false)}
                  className="px-4 py-2 bg-red-500 rounded hover:bg-red-400"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
