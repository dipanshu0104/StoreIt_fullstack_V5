import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FileCard from "../components/minorcomp/FileCard"; // Adjust path as needed
import api from "../utils/api"; // Your Axios instance

const FileDetailPage = () => {
  const { filename } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await api.get("/files"); // Get all files
        const found = res.data.find(f => f.filename === filename);
        if (found) {
          setFile({
            name: found.filename,
            size: found.size,
            date: found.mtime || found.birthtime, // pick whichever is available
          });
        }
      } catch (err) {
        console.error("Failed to fetch file:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [filename]);

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!file) {
    return <div className="text-red-400 p-8">File not found.</div>;
  }

  return (
    <div className="p-8 w-full bg-gray-950 h-full text-white ">
      <h1 className="text-2xl font-bold mb-4 md:mt-0 mt-15">Search</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-7 flex-grow">
        <FileCard file={file} index={0} />
        </div>
    
    </div>
  );
};

export default FileDetailPage;
