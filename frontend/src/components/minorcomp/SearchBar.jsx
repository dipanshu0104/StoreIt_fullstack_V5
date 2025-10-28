"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import SearchFileCard from "./SearchFileCard";

const SearchBar = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await api.get("/files");
        setAllFiles(res.data || []);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      }
    };
    fetchFiles();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
        setResults([]);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim()) {
      const filtered = allFiles.filter((file) =>
        file.filename.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const goToFilePage = (filename) => {
    navigate(`/file/${encodeURIComponent(filename)}`);
    setQuery("");
    setResults([]);
    setShowSearch(false);
  };

  const renderSearchResults = () =>
    results.length > 0 && (
      <ul className="absolute top-full mt-1 left-0 w-full bg-gray-800 text-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
        {results.map((file, idx) => (
          <SearchFileCard
            key={idx}
            file={file}
            onClick={() => goToFilePage(file.filename)}
          />
        ))}
      </ul>
    );

  const SearchInput = (
    <div className="relative w-64" ref={searchRef}>
      <div className="flex items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
        <FiSearch size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          className="ml-2 flex-1 bg-transparent text-white outline-none"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {query && (
          <button
            className="ml-2 text-white hover:text-gray-400"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      {renderSearchResults()}
    </div>
  );

  return isMobile ? (
    <div className="relative">
      <button
        className="p-2 rounded-lg text-white hover:bg-gray-800 transition"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <FiSearch size={20} />
      </button>
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-12 left-20 transform -translate-x-1/2 w-64"
          >
            {SearchInput}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  ) : (
    SearchInput
  );
};

export default SearchBar;
