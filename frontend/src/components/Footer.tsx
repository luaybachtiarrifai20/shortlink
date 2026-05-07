import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              ShortLink Pro
            </span>
            <span className="text-slate-500 text-sm ml-2">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-slate-400 hover:text-white transition-colors">
              About Us
            </Link>
            <Link to="/privacy-policy" className="text-sm text-slate-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
