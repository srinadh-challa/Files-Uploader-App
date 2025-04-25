'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username,
        email,
        password,
      });

      if (res.status === 201) {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-green-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-5xl text-center mb-4"
        >
          📝
        </motion.div>

        <h2 className="text-3xl font-extrabold text-center text-green-700 mb-4">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">Join us and start uploading your files</p>

        {error && (
          <p className="text-red-600 text-center mb-4 text-sm bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition"
          >
            Register
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-green-600 hover:underline font-medium">
            Login here
          </a>
        </div>

        {/* Social register placeholder */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">or sign up with</p>
          <div className="flex justify-center gap-4 mt-2">
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            </button>
            <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">
              <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
