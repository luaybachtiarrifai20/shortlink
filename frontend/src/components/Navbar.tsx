import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { Link2, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 px-4 py-4 sm:px-6">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-4 py-3 sm:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Link2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ShortLink Pro
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl glass-hover text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-xl glass-hover text-sm font-medium text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="btn-primary py-2 px-6 text-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
