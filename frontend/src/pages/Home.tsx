import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ArrowRight, Zap, Shield, Globe, Wifi, Activity, Search, Key, Pencil, Check, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, FRONTEND_URL } from '../utils/constants';
import LoginModal from '../components/LoginModal';
import QuotaModal from '../components/QuotaModal';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Generated link states
  const [shortUrl, setShortUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  
  // Customization states
  const [isEditing, setIsEditing] = useState(false);
  const [customSlug, setCustomSlug] = useState('');
  const [customLoading, setCustomLoading] = useState(false);
  
  // Quota states
  const [customCount, setCustomCount] = useState(0);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const MAX_CUSTOM = 3;
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch custom link count
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/api/links/${user.uid}`)
        .then(res => {
          const count = res.data.filter((l: any) => l.isCustom).length;
          setCustomCount(count);
        })
        .catch(console.error);
    }
  }, [user, shortUrl]); // refetch when shortUrl changes to keep count updated

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
      setShortCode(response.data.shortCode);
      setIsEditing(false); // Reset editing state
      toast.success('Link shortened successfully!');
    } catch (error) {
      toast.error('Failed to shorten link');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    if (customCount >= MAX_CUSTOM) {
      setIsQuotaModalOpen(true);
      return;
    }
    setIsEditing(true);
    setCustomSlug(shortCode);
  };

  const handleCustomize = async () => {
    if (!user) return;
    const trimmed = customSlug.trim();
    if (!trimmed) return;

    setCustomLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/links/${shortCode}/customize`,
        { newSlug: trimmed, userId: user.uid }
      );

      const newUrl = `${FRONTEND_URL}/${trimmed}`;
      setShortUrl(newUrl);
      setShortCode(trimmed);
      setIsEditing(false);
      toast.success('Custom link berhasil disimpan!');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal menyimpan custom link.';
      toast.error(msg);
    } finally {
      setCustomLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 sm:pt-32 sm:pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── 1. Hero + Form ── */}
        <div className="text-center mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-white via-primary-200 to-white bg-clip-text text-transparent leading-tight">
              Shorten Your Links,<br />Expand Your Reach
            </h1>
            <p className="text-slate-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
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
              className="mt-8 glass p-6 rounded-2xl max-w-xl mx-auto border-primary-500/30 overflow-hidden text-left"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-400">Your short link is ready!</p>
                <div className="flex items-center gap-1">
                  {!isEditing && (
                    <button
                      onClick={startEditing}
                      title="Edit Custom Link"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-lg text-xs font-medium transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Custom
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={shortUrl}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-primary-400 font-medium w-full"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl);
                    toast.success('Copied to clipboard!');
                  }}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium shrink-0"
                >
                  Copy
                </button>
              </div>

              {/* Inline Custom Editor */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  >
                    <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-4">
                      <p className="text-xs text-yellow-400/80 mb-3 font-medium">
                        ✏️ Atur custom link Anda ({customCount}/{MAX_CUSTOM} terpakai)
                      </p>
                      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 mb-2">
                        <div className="flex-1 flex items-center gap-1 bg-white/5 rounded-lg px-3 py-2 border border-white/10 min-w-0">
                          <span className="text-slate-500 text-sm shrink-0 truncate max-w-[150px] sm:max-w-none">
                            {FRONTEND_URL.replace('https://', '').replace('http://', '')}/
                          </span>
                          <input
                            autoFocus
                            value={customSlug}
                            onChange={e => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                            placeholder="namalink"
                            className="flex-1 bg-transparent text-white text-base outline-none min-w-0"
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleCustomize();
                              if (e.key === 'Escape') setIsEditing(false);
                            }}
                          />
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={handleCustomize}
                            disabled={customLoading || customSlug.length < 3}
                            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                            {customLoading ? 'Menyimpan...' : 'Simpan'}
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 sm:flex-none flex justify-center items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <X className="w-4 h-4" />
                            Batal
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        Hanya huruf, angka, - dan _. Minimal 3 karakter.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* ── 2. Try Another App & Ad Space ── */}
        <div className="mb-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tools Grid */}
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-white">
              Try Another App / Tools<br />
              <span className="text-base sm:text-xl text-slate-400 font-normal">(Click App Icon Below)</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Wifi,     title: 'Check Signal Speed',  desc: 'Test your internet connection speed instantly.' },
                { icon: Activity, title: 'Check Website Speed', desc: 'Analyze load times and performance of any site.' },
                { icon: Search,   title: 'SEO Checker',         desc: 'Audit your website for search engine optimization.' },
                { icon: Key,      title: 'Password Generator',  desc: 'Create strong, secure passwords with one click.' }
              ].map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-6 rounded-3xl group hover:border-primary-500/50 transition-colors cursor-pointer"
                >
                  <div className="bg-primary-600/20 p-3 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <tool.icon className="text-primary-400 w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">{tool.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{tool.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Ad / Space */}
          <div className="lg:col-span-1">
            <h2 className="text-xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-white text-center">Space</h2>
            <div className="glass p-4 rounded-3xl flex items-center justify-center min-h-[400px] hover:border-primary-500/50 transition-colors">
              <img
                src="/images/poster1.png"
                alt="Ad Placeholder"
                className="w-full h-auto object-cover rounded-2xl opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>

        {/* ── 3. Lightning Fast · Secure · QR Codes ── */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: Zap,    title: 'Lightning Fast',    desc: 'Links redirect in milliseconds worldwide.' },
            { icon: Shield, title: 'Secure & Reliable', desc: 'Your data is safe with Firebase encrypted storage.' },
            { icon: Globe,  title: 'QR Codes Included', desc: 'Every link automatically gets a custom QR code.' }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="glass p-8 rounded-3xl group hover:border-primary-500/50 transition-colors"
            >
              <div className="bg-primary-600/20 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-primary-400 w-8 h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── 4. New Spaces — Bottom Ads ── */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-3xl font-extrabold mb-8 sm:mb-12 text-white text-center">New Spaces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                className="glass p-4 rounded-3xl flex flex-col items-center justify-center aspect-[3/4] hover:border-primary-500/50 transition-colors relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/40 to-transparent" />
                <p className="text-slate-500 font-bold text-xl z-10 mb-2">Space Ad {item}</p>
                <div className="w-16 h-1 bg-primary-500/30 rounded-full z-10" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          if (url) {
            handleShorten({ preventDefault: () => {} } as React.FormEvent);
          }
        }}
      />

      <QuotaModal 
        isOpen={isQuotaModalOpen} 
        onClose={() => setIsQuotaModalOpen(false)} 
        maxCustom={MAX_CUSTOM} 
      />
    </div>
  );
}
