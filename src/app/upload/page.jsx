'use client';
import FileUpload from '../../components/FileUpload';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center px-2">
      <FileUpload />
    </div>
  );
}
