import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Link2, Calendar, MousePointer2, Download, Copy, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

interface LinkData {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: { _seconds: number };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const downloadQRCode = (id: string) => {
    const svg = document.getElementById(`qr-${id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qrcode-${id}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  return (
    <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Links</h1>
          <p className="text-slate-400">Manage and track your shortened URLs.</p>
        </div>
        <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-500 uppercase tracking-wider">Total Links</p>
            <p className="text-2xl font-bold">{links.length}</p>
          </div>
          <div className="w-[1px] h-10 bg-white/10"></div>
          <div className="text-center">
            <p className="text-sm text-slate-500 uppercase tracking-wider">Total Clicks</p>
            <p className="text-2xl font-bold text-primary-400">
              {links.reduce((acc, curr) => acc + curr.clicks, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {links.map((link, i) => (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl group"
          >
            <div className="flex flex-col sm:flex-row gap-6">
              {/* QR Code */}
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-2xl">
                  <QRCodeSVG
                    id={`qr-${link.shortCode}`}
                    value={`${API_BASE_URL}/${link.shortCode}`}
                    size={120}
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
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary-600/20 text-primary-400 px-3 py-1 rounded-lg text-sm font-bold">
                    /{link.shortCode}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => copyToClipboard(`${API_BASE_URL}/${link.shortCode}`)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-lg truncate mb-1 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-500" />
                  <a href={link.originalUrl} target="_blank" rel="noreferrer" className="hover:text-primary-400 transition-colors">
                    {link.originalUrl}
                  </a>
                </h3>

                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MousePointer2 className="w-4 h-4" />
                    <span className="font-bold text-white">{link.clicks}</span> clicks
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
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
