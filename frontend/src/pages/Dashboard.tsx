import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Calendar, MousePointer2, Download, Copy, Trash2, Pencil, Check, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL, FRONTEND_URL } from '../utils/constants';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: { _seconds: number };
  isCustom?: boolean;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

  // Custom link state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customSlug, setCustomSlug] = useState('');
  const [customLoading, setCustomLoading] = useState(false);

  const customCount = links.filter(l => l.isCustom).length;
  const MAX_CUSTOM = 3;

  useEffect(() => {
    const fetchLinks = async () => {
      if (!user) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/links/${user.uid}`);
        setLinks(response.data);
      } catch (error) {
        console.error('Error fetching links:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, [user]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleDelete = async (shortCode: string) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/links/${shortCode}`);
      setLinks(links.filter(link => link.shortCode !== shortCode));
      toast.success('Link deleted successfully!');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link.');
    }
  };

  const downloadQRCode = (id: string) => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const startEditing = (link: LinkData) => {
    // Check quota — if not already custom and quota full, block
    if (!link.isCustom && customCount >= MAX_CUSTOM) {
      toast.error(`Batas ${MAX_CUSTOM} custom link tercapai. Hapus custom link lain terlebih dahulu.`);
      return;
    }
    setEditingId(link.shortCode);
    setCustomSlug(link.shortCode);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setCustomSlug('');
  };

  const handleCustomize = async (shortCode: string) => {
    if (!user) return;
    const trimmed = customSlug.trim();
    if (!trimmed) return;

    setCustomLoading(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/links/${shortCode}/customize`,
        { newSlug: trimmed, userId: user.uid }
      );

      // Update local state: replace old link with updated one
      setLinks(prev =>
        prev.map(l =>
          l.shortCode === shortCode
            ? { ...l, shortCode: trimmed, id: trimmed, isCustom: true }
            : l
        )
      );
      toast.success('Custom link berhasil disimpan!');
      setEditingId(null);
      setCustomSlug('');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Gagal menyimpan custom link.';
      toast.error(msg);
    } finally {
      setCustomLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">My Links</h1>
          <p className="text-sm sm:text-base text-slate-400">Manage and track your shortened URLs.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Stats card */}
          <div className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Links</p>
              <p className="text-xl sm:text-2xl font-bold">{links.length}</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Total Clicks</p>
              <p className="text-xl sm:text-2xl font-bold text-primary-400">
                {links.reduce((acc, curr) => acc + curr.clicks, 0)}
              </p>
            </div>
          </div>

          {/* Custom quota card */}
          <div className="glass px-4 sm:px-6 py-3 sm:py-4 rounded-2xl flex items-center gap-3">
            <Star className="w-4 h-4 text-yellow-400 shrink-0" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Custom Links</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className={`w-5 h-2 rounded-full transition-colors ${
                        i < customCount ? 'bg-yellow-400' : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-slate-300">{customCount}/{MAX_CUSTOM}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {links.map((link, i) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-5 sm:p-6 rounded-3xl group"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="bg-white p-3 rounded-2xl">
                  <QRCodeSVG
                    id={`qr-${link.shortCode}`}
                    value={`${FRONTEND_URL}/${link.shortCode}`}
                    size={100}
                    level="H"
                  />
                </div>
                <button
                  onClick={() => downloadQRCode(link.shortCode)}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  <Download className="w-3 h-3" />
                  Download PNG
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Slug bar + action buttons */}
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                      link.isCustom
                        ? 'bg-yellow-400/20 text-yellow-300'
                        : 'bg-primary-600/20 text-primary-400'
                    }`}>
                      {link.isCustom && <Star className="w-3 h-3" />}
                      /{link.shortCode}
                    </div>
                    {link.isCustom && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400 font-medium border border-yellow-400/20">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1 shrink-0">
                    {/* Customize button */}
                    <button
                      onClick={() => startEditing(link)}
                      title="Custom link"
                      className={`p-2 rounded-lg transition-colors ${
                        !link.isCustom && customCount >= MAX_CUSTOM
                          ? 'opacity-30 cursor-not-allowed text-slate-600'
                          : 'hover:bg-yellow-400/10 text-slate-400 hover:text-yellow-400'
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(`${FRONTEND_URL}/${link.shortCode}`)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Custom slug editor */}
                <AnimatePresence>
                  {editingId === link.shortCode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 overflow-hidden"
                    >
                      <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-3">
                        <p className="text-xs text-yellow-400/80 mb-2 font-medium">
                          ✏️ Atur custom link Anda ({customCount}/{MAX_CUSTOM} terpakai)
                        </p>
                        <div className="flex items-center gap-1 bg-white/5 rounded-lg px-3 py-2 border border-white/10 mb-2">
                          <span className="text-slate-500 text-xs shrink-0">
                            {FRONTEND_URL.replace('https://', '').replace('http://', '')}/
                          </span>
                          <input
                            autoFocus
                            value={customSlug}
                            onChange={e => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                            placeholder="namalink"
                            className="flex-1 bg-transparent text-white text-sm outline-none min-w-0"
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleCustomize(link.shortCode);
                              if (e.key === 'Escape') cancelEditing();
                            }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 mb-2">
                          Hanya huruf, angka, - dan _. Minimal 3 karakter.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCustomize(link.shortCode)}
                            disabled={customLoading || customSlug.length < 3}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {customLoading ? 'Menyimpan...' : 'Simpan'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Batal
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Original URL */}
                <h3 className="font-semibold text-sm sm:text-base truncate mb-1 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <a
                    href={link.originalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-primary-400 transition-colors truncate"
                  >
                    {link.originalUrl}
                  </a>
                </h3>

                {/* Stats row */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <MousePointer2 className="w-4 h-4" />
                    <span className="font-bold text-white">{link.clicks}</span> clicks
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {new Date(link.createdAt?._seconds * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl">
          <Link2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No links found. Start shortening links to see them here!</p>
        </div>
      )}
    </div>
  );
}
