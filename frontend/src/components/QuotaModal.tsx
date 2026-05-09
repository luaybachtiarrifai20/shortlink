import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  maxCustom: number;
}

export default function QuotaModal({ isOpen, onClose, maxCustom }: QuotaModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass p-8 sm:p-10 rounded-3xl shadow-2xl border border-yellow-400/20"
          >
            <button
              onClick={onClose}
              className="absolute right-6 top-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white">Batas Custom Link Tercapai</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                Anda telah menggunakan seluruh kuota <strong className="text-yellow-400">{maxCustom} custom link</strong> yang tersedia. 
                Untuk membuat custom link baru, harap hapus salah satu custom link lama Anda di Dashboard agar ruang tersedia kembali.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-yellow-400 text-slate-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors"
              >
                Menuju Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
