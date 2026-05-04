import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../utils/constants';
import LoginModal from '../components/LoginModal';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, {
        originalUrl: url,
        userId: user?.uid,
        email: user?.email
      });
      setShortUrl(response.data.shortUrl);
      toast.success('Link shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent">
              Shorten Your Links,<br />Expand Your Reach
            </h1>
            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
              Create short, powerful links and track their performance. 
              Automatic QR code generation included for every link.
            </p>
          </motion.div>

          {/* Shorten Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto glass p-2 rounded-2xl flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="url"
                placeholder="Paste your long URL here..."
                className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handleShorten}
              disabled={loading}
              className="btn-primary py-4 px-8 flex items-center justify-center gap-2"
            >
              {loading ? 'Shortening...' : 'Shorten Now'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Result */}
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 glass p-6 rounded-2xl max-w-xl mx-auto border-primary-500/30"
            >
              <p className="text-sm text-slate-400 mb-2">Your short link is ready!</p>
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={shortUrl}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-primary-400 font-medium"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    toast.success('Copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  Copy
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: Zap, title: 'Lightning Fast', desc: 'Links redirect in milliseconds worldwide.' },
            { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is safe with Firebase encrypted storage.' },
            { icon: Globe, title: 'QR Codes Included', desc: 'Every link automatically gets a custom QR code.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="glass p-8 rounded-3xl group hover:border-primary-500/50 transition-colors"
            >
              <div className="bg-primary-600/20 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-primary-400 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          // Trigger shortening after successful login if url is present
          if (url) {
            handleShorten({ preventDefault: () => {} } as React.FormEvent);
          }
        }}
      />
    </div>
  );
}
