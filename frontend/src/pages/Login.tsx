import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import toast from 'react-hot-toast';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync user with backend
      await axios.post(`${API_BASE_URL}/api/users`, {
        userId: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      });

      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass p-10 rounded-3xl text-center">
          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-3">Welcome Back</h2>
            <p className="text-slate-400 text-lg">Sign in with Google to manage your links</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-5 px-6 bg-white text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
            {loading ? 'Connecting...' : 'Continue with Google'}
          </button>

          <p className="mt-10 text-sm text-slate-500">
            Secure, passwordless login powered by Google.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
