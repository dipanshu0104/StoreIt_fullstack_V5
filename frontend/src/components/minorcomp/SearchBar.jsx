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
  const searchRef = useRef(null);

  // ✅ Fetch files every time search query changes (fresh data)
  const fetchFiles = async (searchText = "") => {
    try {
      const res = await api.get("/files");
      const allFiles = res.data || [];

      if (searchText.trim()) {
        const filtered = allFiles.filter((file) =>
          file.filename.toLowerCase().includes(searchText.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  };

  useEffect(() => {
    if (query.trim()) {
      const delayDebounce = setTimeout(() => fetchFiles(query), 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setResults([]);
    }
  }, [query]);

  // Close search when clicked outside
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

  const goToFilePage = (filename) => {
    navigate(`/file/${encodeURIComponent(filename)}`);
    setQuery("");
    setResults([]);
    setShowSearch(false);
  };

  const renderSearchResults = () =>
    results.length > 0 && (
      <ul className="absolute top-full mt-1 left-0 w-full bg-gray-800 text-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-[120]">
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
    <div className="relative w-64 z-[100]" ref={searchRef}>
      <div className="flex items-center bg-gray-950 p-2 rounded-lg border border-gray-800 shadow-lg">
        <FiSearch size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          className="ml-2 flex-1 bg-transparent text-white outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
    <div className="relative z-[100]">
      <button
        className="p-2 rounded-lg text-white hover:bg-gray-800 transition"
        onClick={() => setShowSearch((prev) => !prev)}
      >
        <FiSearch size={20} />
      </button>

      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-[90]"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm"
            >
              <div className="bg-gray-950 rounded-lg border border-gray-800 shadow-lg">
                <div ref={searchRef} className="relative w-full">
                  <div className="flex items-center bg-gray-950 p-2 rounded-lg border border-gray-800">
                    <FiSearch size={18} className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search files..."
                      className="ml-2 flex-1 bg-transparent text-white outline-none"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  ) : (
    SearchInput
  );
};

export default SearchBar;
