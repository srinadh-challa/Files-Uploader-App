'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-blue-100 to-pink-200 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="bg-white shadow-2xl rounded-3xl p-10 max-w-2xl w-full text-center border border-blue-200 relative overflow-hidden"
      >
        {/* Floating Background Circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-200 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse" />

        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-6xl mb-4"
        >
          📂
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to <span className="text-purple-600">Uploader App</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-6">
          Seamlessly upload, organize, and view your files with ease.
        </p>

        <Link
          href="/upload"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md transform hover:scale-105"
        >
          🚀 Upload Your First File
        </Link>
      </motion.div>
    </div>
  );
}
