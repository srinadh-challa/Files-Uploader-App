'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, List, Grid3X3, LayoutGrid } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function FilesPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allFiles, setAllFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState('tiles');
  const [activeTab, setActiveTab] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filesPerPage = 6;

  useEffect(() => {
    fetchFiles();
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme === 'true') setDarkMode(true);
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/files');
      setAllFiles(res.data.data);
      setUploadedFiles(res.data.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newVal = !prev;
      localStorage.setItem('darkMode', newVal.toString());
      return newVal;
    });
  };

  const deleteFile = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/files/${id}`);
      setUploadedFiles((prev) => prev.filter((file) => file._id !== id));
      setAllFiles((prev) => prev.filter((file) => file._id !== id));
      if (searchTerm) handleSearch({ target: { value: searchTerm } });
    } catch (error) {
      alert('Failed to delete file.');
    } finally {
      setLoading(false);
    }
  };

  const getFileType = (url) => {
    if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) return 'Image';
    if (url.match(/\.(mp4|webm|ogg)$/i)) return 'Video';
    if (url.match(/\.(mp3|wav)$/i)) return 'Audio';
    return 'Document';
  };

  const filteredFiles = uploadedFiles.filter((file) => {
    if (activeTab === 'all') return true;
    return getFileType(file.url).toLowerCase() === activeTab;
  });

  const indexOfLast = currentPage * filesPerPage;
  const indexOfFirst = indexOfLast - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  const handleTabChange = (type) => {
    setActiveTab(type);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    if (!searchTerm) {
      setUploadedFiles(allFiles);
      return;
    }

    const filtered = allFiles.filter((file) => {
      return (
        file.filename?.toLowerCase().includes(searchTerm) ||
        getFileType(file.url).toLowerCase().includes(searchTerm) ||
        file.public_id?.toLowerCase().includes(searchTerm) ||
        new Date(file.uploadedAt).toLocaleString().toLowerCase().includes(searchTerm)
      );
    });

    setUploadedFiles(filtered);
    setCurrentPage(1);
  };

  const renderFilePreview = (file, fileType) => {
    const previewClass = viewType === 'list' ? 'w-12 h-12' : viewType === 'medium' ? 'w-24 h-24' : 'w-full h-48 object-cover';

    if (fileType === 'Image') {
      return <img src={file.url} alt="preview" className={`${previewClass} rounded mb-2`} />;
    } else if (fileType === 'Video') {
      return <video controls className={`${previewClass} rounded mb-2`}><source src={file.url} type="video/mp4" /></video>;
    } else if (fileType === 'Audio') {
      return <audio controls className="w-full mt-2 mb-2"><source src={file.url} type="audio/mpeg" /></audio>;
    } else {
      return <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">📄 Document File</div>;
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className={`p-6 min-h-screen transition-all duration-300 bg-gradient-to-br ${darkMode ? 'from-gray-900 via-gray-800 to-gray-900' : 'from-blue-100 via-white to-blue-50'} dark:text-white`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>📁 Uploaded Files: {uploadedFiles.length}</h1>
          <motion.button
            whileTap={{ rotate: 180 }}
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center gap-2 shadow-lg"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.button>
        </div>

        <input
          type="search"
          placeholder="🔍 Search files..."
          className="mb-6 w-full max-w-md p-3 border border-blue-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
          onChange={handleSearch}
        />

        <div className="mb-4 flex flex-wrap gap-2">
          {['all', 'image', 'video', 'audio', 'document'].map((type) => (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={type}
              onClick={() => handleTabChange(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                activeTab === type
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        <div className="mb-6 flex justify-end items-center gap-2">
          <label htmlFor="viewType" className="text-blue-700">View:</label>
          <select
            id="viewType"
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="p-2 bg-white border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="list">List</option>
            <option value="medium">Medium</option>
            <option value="tiles">Tiles</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner message="Loading files..." />
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewType === 'tiles' ? 'sm:grid-cols-2 lg:grid-cols-3' :
              viewType === 'medium' ? 'sm:grid-cols-3 lg:grid-cols-4' :
              'grid-cols-1'
            }`}
          >
            <AnimatePresence>
              {currentFiles.map((file, i) => {
                const fileType = getFileType(file.url);
                return (
                  <motion.div
                    key={file._id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-xl transition duration-300"
                  >
                    <span className="inline-block mb-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                      {fileType}
                    </span>
                    {renderFilePreview(file, fileType)}
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-300 text-sm font-medium break-words hover:underline block mt-2">
                      {file.filename || file.url}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                      Uploaded at: {new Date(file.uploadedAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => deleteFile(file._id || file.public_id)}
                      className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
