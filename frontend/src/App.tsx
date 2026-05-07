import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RedirectPage from './pages/RedirectPage';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthProvider from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/:shortCode" element={<RedirectPage />} />
          </Routes>
          <Footer />
          <Toaster position="bottom-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
