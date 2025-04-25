'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/authContext';
import { useEffect, useState } from 'react';
import { Moon, Sun, UserCircle, LogOut } from 'lucide-react';

export default function NavBar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-xl tracking-wide">📁 Uploader App</span>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
          <button onClick={() => setDarkMode(!darkMode)} className="transition hover:scale-105">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 hover:scale-105 transition">
              <UserCircle size={24} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded shadow-lg p-2 text-sm">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <button onClick={() => setDarkMode(!darkMode)}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <NavLinks mobile />
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white w-full">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const linkClass = mobile
    ? 'block py-2 text-white hover:text-gray-200'
    : 'hover:bg-white hover:text-blue-700 px-3 py-2 rounded transition font-medium dark:hover:bg-gray-700 dark:hover:text-white';

  return (
    <>
      <Link href="/" className={linkClass}>Home</Link>
      <Link href="/upload" className={linkClass}>Upload</Link>
      <Link href="/files" className={linkClass}>Files</Link>
      <Link href="/about" className={linkClass}>About</Link>
      <Link href="/contact" className={linkClass}>Contact</Link>
    </>
  );
}
