'use client';
import './globals.css';
import NavBar from '../components/NavBar';
import { useAuth, AuthProvider } from './context/authContext';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-gray-100 min-h-screen flex flex-col h-full">
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <NavBar />}
      <main className="flex-1">{children}</main>
      
      {isAuthenticated && (
        <footer className="bg-gray-800 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={16} /> <span>Email: example@example.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} /> <span>Phone: +1234567890</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} /> <span>Address: 123 Main St, City</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} /> <span>Website: www.example.com</span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </footer>
      )}
      
      </>
  );
}
