'use client';
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner'; // Ensure you have this component (below)
import { motion } from 'framer-motion';
import { FileType } from '@/app/types/fileTypes';

export default function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<FileType[]>([]);
  const [visibleFiles, setVisibleFiles] = useState<FileType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFiles, setShowFiles] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [viewType, setViewType] = useState('tiles');
  const [dragOver, setDragOver] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<string[]>([]); // Track uploading files by ID
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/files');
      const data = res.data.data;
      if (!Array.isArray(data)) {
        console.error('Expected array but got:', data);
        setUploadedFiles([]);
        setVisibleFiles([]);
      } else {
        setUploadedFiles(data);
        setVisibleFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const fileId = `${Date.now()}-${file.name}`; // Create a temporary unique ID for the file

    setUploadingFiles((prev) => [...prev, fileId]); // Mark the file as uploading

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      const newFile = res.data.data;
      if (!newFile || typeof newFile !== 'object') {
        console.error('Invalid file upload response:', newFile);
        return;
      }
      setUploadedFiles((prev) => [...prev, newFile]);
      if (filterFile(newFile, activeTab)) {
        setVisibleFiles((prev) => [...prev, newFile]);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setLoading(false);
      setUploadingFiles((prev) => prev.filter((id) => id !== fileId)); // Remove the file from uploading list
    }
  };

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const triggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const filterFile = (file: FileType, type: string) => {
    const url = file.url.toLowerCase();
    if (type === 'Images') return /\.(jpg|jpeg|png|webp|gif)$/.test(url);
    if (type === 'Videos') return /\.(mp4|webm|ogg)$/.test(url);
    if (type === 'Audio') return /\.(mp3|wav)$/.test(url);
    if (type === 'Documents') return !/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mp3|wav)$/.test(url);
    return true;
  };

  const handleTabChange = (type: string) => {
    setActiveTab(type);
    setVisibleFiles(uploadedFiles.filter((file) => filterFile(file, type)));
  };

  const deleteFile = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`);
      const updated = uploadedFiles.filter((f) => f._id !== id);
      setUploadedFiles(updated);
      setVisibleFiles(updated.filter((file) => filterFile(file, activeTab)));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const renderPreview = (file: FileType) => {
    const url = file.url.toLowerCase();
    const isUploading = uploadingFiles.includes(file._id); // Check if the file is being uploaded

    if (isUploading) {
      return (
        <div className="w-full h-48 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (/\.(jpg|jpeg|png|gif|webp)$/.test(url)) {
      return <img src={file.url} alt="preview" className={`${viewType === 'list' ? 'w-10 h-10' : viewType === 'medium' ? 'w-20 h-20 object-cover' : 'w-full h-48 object-cover'} rounded`} />;
    } else if (/\.(mp4|webm|ogg)$/.test(url)) {
      return <video src={file.url} controls className="w-full h-48 rounded" />;
    } else if (/\.(mp3|wav)$/.test(url)) {
      return <audio src={file.url} controls className="w-full" />;
    } else {
      return (
        <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 underline break-words">
          {file.filename || file.url}
        </a>
      );
    }
  };

  useEffect(() => {
    if (showFiles) {
      fetchFiles();
    }
  }, [showFiles]);

  return (
    <div
      onDrop={handleFileDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      className={`max-w-3xl mx-auto p-6 rounded-xl shadow-lg mt-10 transition-colors duration-300 ${dragOver ? 'bg-blue-100' : 'bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700'}`}
    >
      <h2 className="text-3xl font-extrabold mb-4 text-white">📁 Upload & View Files</h2>

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />

      <div className="flex gap-3 mb-6">
        <button onClick={triggerFilePicker} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105">
          Select File
        </button>
        <button onClick={() => setShowFiles((prev) => !prev)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105">
          {showFiles ? 'Hide Files' : 'View Uploaded Files'}
        </button>
        <div className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105">
        {loading ? 'Loading...' : uploadingFiles.length} files uploading
        </div>
        <div className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105">
           uploaded {uploadedFiles.length} files
        </div>
      </div>
      <div className="flex items-center mb-4">
        <label className="text-white mr-2 ml-4">Drag & Drop to Upload</label>
      </div>
      {showFiles && (
        <>
          <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-4 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <label htmlFor="fileType" className="block text-white text-center mb-2">Filter by Type</label>
              <select
                id="fileType"
                value={activeTab}
                onChange={(e) => handleTabChange(e.target.value)}
                className="w-full p-2 bg-white rounded-lg text-gray-700 shadow-md"
              >
                {['All', 'Images', 'Videos', 'Audio', 'Documents'].map((tab) => (
                  <option key={tab} value={tab} className="text-gray-800">
                    {tab}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="viewType" className="block text-white text-center mb-2">View Type</label>
              <select
                id="viewType"
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="w-full p-2 bg-white rounded-lg text-gray-700 shadow-md"
              >
                {['tiles', 'medium', 'list'].map((type) => (
                  <option key={type} value={type} className="text-gray-800">
                    {type.charAt(0).toUpperCase() + type.slice(1)} View
                  </option>
                ))}
              </select>

            </div>
          </div>
          {loading ? (
            <div className="p-10 flex justify-center">
              <LoadingSpinner message="Loading files..." />
            </div>
          ) : visibleFiles.length > 0 ? (
            <div className={`grid gap-4 ${
              viewType === 'tiles' ? 'sm:grid-cols-2' : viewType === 'medium' ? 'sm:grid-cols-3' : 'grid-cols-1'
            }`}>
              {visibleFiles.map((file, index) => (
                <motion.div
                  key={file._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white p-3 rounded-lg shadow-lg border-2 border-blue-500 transition duration-300 transform hover:scale-105 hover:shadow-2xl"
                >
                  {renderPreview(file)}
                  <p className="text-sm text-gray-600 mt-2 truncate">{file.filename}</p>
                  <button onClick={() => deleteFile(file._id)} className="text-red-600 text-xs mt-1 hover:underline">Delete</button>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white">No files found in this category.</p>
          )}
        </>

      )}
    </div>
  );
}
