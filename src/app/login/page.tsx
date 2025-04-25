'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/login', { email, password });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        login();
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid credentials or server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-blue-200"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-5xl text-center mb-4"
        >
          🔐
        </motion.div>

        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-4">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Login to continue managing your files</p>

        {error && (
          <p className="text-red-600 text-center mb-4 text-sm bg-red-50 border border-red-200 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </a>
        </div>

        {/* Social login placeholder */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">or login with</p>
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
