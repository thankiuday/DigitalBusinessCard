import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Plus, LayoutDashboard, LogOut, User, ChevronDown } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import useCardStore from '../../store/useCardStore';
import Button from '../ui/Button';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const resetDraft = useCardStore((s) => s.resetDraft);
  const navigate = useNavigate();
  const location = useLocation();

  const goToNewCard = () => {
    resetDraft();
    navigate('/create');
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Phygital</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/#features" className="text-white/60 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors">
              Features
            </Link>
            <Link to="/#pricing" className="text-white/60 hover:text-white px-3 py-2 rounded-lg text-sm transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={15} />}
                  onClick={goToNewCard}
                  className="hidden md:inline-flex"
                >
                  Create Card
                </Button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gradient-brand flex items-center justify-center text-xs font-bold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm text-white/80 hidden sm:block max-w-[100px] truncate">
                      {user?.name}
                    </span>
                    <ChevronDown size={14} className={`text-white/40 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 glass-card border border-white/10 shadow-glass py-1"
                      >
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <LayoutDashboard size={15} />
                          Dashboard
                        </Link>
                        <hr className="border-white/10 my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hidden md:block text-white/60 hover:text-white text-sm px-3 py-2 transition-colors">
                  Sign In
                </Link>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              <Link to="/#features" className="block text-white/60 hover:text-white py-2 text-sm">Features</Link>
              <Link to="/#pricing" className="block text-white/60 hover:text-white py-2 text-sm">Pricing</Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block text-white/60 hover:text-white py-2 text-sm">Dashboard</Link>
                  <Link
                    to="/create"
                    onClick={() => resetDraft()}
                    className="block text-white/60 hover:text-white py-2 text-sm"
                  >
                    Create Card
                  </Link>
                  <button onClick={handleLogout} className="block text-red-400 py-2 text-sm w-full text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-white/60 hover:text-white py-2 text-sm">Sign In</Link>
                  <Link to="/register" className="block text-white py-2 text-sm font-medium">Get Started →</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
