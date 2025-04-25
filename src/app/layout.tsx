// app/layout.tsx or layout.jsx (NOT page.tsx)

'use client';
import './globals.css';
import NavBar from '../components/NavBar';
import { useAuth, AuthProvider } from './context/authContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </body>
    </html>
  );
}

// This is needed to use the hook inside the component
function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated && <NavBar />}
      <main>{children}</main>
    </>
  );
}
