import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback, useRef } from "react";
import FileCard from "../components/minorcomp/FileCard";
import api from "../utils/api";
import socket from "../utils/socket";

const FileDetailPage = () => {
  const { filename } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(true);

  const fetchFile = useCallback(
    async (showLoader = false) => {
      if (showLoader) setLoading(true);

      try {
        const res = await api.get("/files");
        const files = res.data;

        let found = files.find((f) => f.filename === filename);

        // Check if file was renamed
        if (!found && file) {
          found = files.find(
            (f) =>
              f.size === file.size &&
              (f.birthtime === file.date || f.mtime === file.date)
          );

          if (found) {
            // Navigate to new file route
            navigate(`/file/${found.filename}`, { replace: true });
            return;
          }
        }

        if (found) {
          setFile((prev) => ({
            ...prev,
            name: found.filename,
            size: found.size,
            date: found.mtime || found.birthtime,
            previewUrl:
              found.previewUrl ||
              `${api.defaults.baseURL}/files/preview/${found.filename}`,
          }));
        } else {
          setFile(null);
        }
      } catch (err) {
        console.error("Failed to fetch file:", err);
      } finally {
        setLoading(false);
      }
    },
    [filename, file, navigate]
  );

  useEffect(() => {
    // ✅ Show loader only on first load
    fetchFile(true);

    const handleFileUpdate = () => {
      // ✅ Update silently in the background (no flicker)
      fetchFile(false);
    };

    socket.on("file:list:updated", handleFileUpdate);

    return () => {
      socket.off("file:list:updated", handleFileUpdate);
    };
  }, [fetchFile]);

  if (loading && firstLoad.current) {
    firstLoad.current = false;
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!file) {
    return (
      <div className="p-8 rounded-xl w-full bg-gray-950 h-full text-white transition-all duration-300">
        <h1 className="text-2xl font-bold mb-4 md:mt-0 mt-15 h-1/2">
          Searched file
        </h1>
        <div className="flex justify-center item-center">File not found.</div>
      </div>
    );
  }

  return (
    <div className="p-8 w-full rounded-xl bg-gray-950 h-full text-white transition-all duration-300">
      <h1 className="text-2xl font-bold mb-4 md:mt-0 mt-15">Searched file</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-7 flex-grow">
        <FileCard file={file} index={0} />
      </div>
    </div>
  );
};

export default FileDetailPage;
