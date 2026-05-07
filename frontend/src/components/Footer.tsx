import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <span className="text-2xl md:text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              ShortLink Pro
            </span>
            <span className="text-slate-500 text-sm mt-2 md:mt-0 md:ml-2">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link 
              to="/blog" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              About Us
            </Link>
            <Link 
              to="/privacy-policy" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition-colors border border-white/10"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
