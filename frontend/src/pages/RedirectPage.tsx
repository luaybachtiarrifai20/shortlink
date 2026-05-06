import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveLink = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/resolve/${shortCode}`);
        const { originalUrl } = response.data;
        
        // Redirect the user
        window.location.replace(originalUrl);
      } catch (err: any) {
        console.error('Error resolving link:', err);
        setError(err.response?.data?.error || 'Short link not found or has been deleted.');
      }
    };

    if (shortCode) {
      resolveLink();
    }
  }, [shortCode]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-bold text-white mb-4">Oops!</h1>
        <p className="text-gray-400 text-lg mb-8">{error}</p>
        <a 
          href="/" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
      <h1 className="text-2xl font-bold text-white mb-2">Redirecting...</h1>
      <p className="text-gray-400">Please wait while we take you to your destination.</p>
    </div>
  );
};

export default RedirectPage;
