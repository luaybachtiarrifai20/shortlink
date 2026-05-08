import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { Link2, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-3 sm:px-6 flex items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Link2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ShortLink Pro
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/blog" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Blog
          </Link>
          <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            About Us
          </Link>
          <Link to="/privacy-policy" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl glass-hover text-sm font-medium hidden sm:flex"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl glass-hover text-sm font-medium text-red-400 hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="btn-primary py-2 px-6 text-sm hidden sm:flex"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-900 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl shadow-black/50 border border-white/10 z-50">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
            >
              Home
            </Link>
            <Link 
              to="/blog" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
            >
              Blog
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
            >
              About Us
            </Link>
            <Link 
              to="/privacy-policy" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
            >
              Privacy Policy
            </Link>
            <div className="h-[1px] w-full bg-white/10 my-2"></div>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors px-2 py-1 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-primary py-2 px-6 text-sm text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
