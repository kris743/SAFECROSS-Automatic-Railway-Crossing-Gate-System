import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSensor } from '../context/SensorContext';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../api/mockData';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useSensor();
  const { user, logout, isAdmin, isRailway, isUser, canControl } = useAuth();

  const getNavLinks = () => {
    const links = [{ to: '/', label: 'Home', icon: '🏠' }];

    if (!user) {
      links.push({ to: '/login', label: 'Login', icon: '🔐' });
      links.push({ to: '/project', label: 'Project', icon: '📋' });
      return links;
    }

    if (isUser) {
      links.push({ to: '/tracking', label: 'Train Track', icon: '🚂' });
      links.push({ to: '/project', label: 'Project', icon: '📋' });
    } else {
      links.push({ to: '/dashboard', label: 'Dashboard', icon: '📊' });
      links.push({ to: '/controls', label: 'Controls', icon: '🎛️' });
      links.push({ to: '/esp', label: 'ESP Devices', icon: '📟' });
      links.push({ to: '/tracking', label: 'Tracking', icon: '🚂' });
      links.push({ to: '/project', label: 'Project', icon: '📋' });
    }

    return links;
  };

  const navLinks = getNavLinks();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const roleColors = {
    admin: 'text-neon-red bg-neon-red/10 border-neon-red/20',
    railway: 'text-neon-yellow bg-neon-yellow/10 border-neon-yellow/20',
    user: 'text-neon-blue bg-neon-blue/10 border-neon-blue/20',
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo — animated train icon instead of SC box */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="text-2xl animate-float">🚦</span>
            <span className="text-white font-extrabold text-xl tracking-tight">
              SAFE<span className="text-neon-green text-glow-green">CROSS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-all whitespace-nowrap nav-link-hover ${
                  isActive(link.to)
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20 glow-green-subtle'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}>
                <span className="mr-1.5">{link.icon}</span>{link.label}
              </Link>
            ))}
          </div>

          {/* Right Controls */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <button onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer hover:rotate-180 duration-500">
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${roleColors[user.role]}`}>
                  <span>{user.role === 'admin' ? '🛡️' : user.role === 'railway' ? '🚂' : '👤'}</span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>
                <button onClick={handleLogout}
                  className="px-5 py-2.5 rounded-lg bg-neon-red/10 text-neon-red border border-neon-red/20 text-sm font-bold hover:bg-neon-red/20 hover:scale-105 transition-all cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login"
                className="px-7 py-2.5 rounded-lg bg-gradient-to-r from-neon-green/15 to-neon-blue/15 text-neon-green border border-neon-green/25 text-base font-bold hover:from-neon-green/25 hover:to-neon-blue/25 hover:scale-105 transition-all login-btn-glow">
                🔐 Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white p-2 cursor-pointer">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-white/5">
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                    isActive(link.to)
                      ? 'bg-neon-green/10 text-neon-green'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <span className="mr-2">{link.icon}</span>{link.label}
                </Link>
              ))}

              <div className="pt-4 mt-2 border-t border-white/5">
                {user ? (
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${roleColors[user.role]}`}>
                      <span>{user.role === 'admin' ? '🛡️' : user.role === 'railway' ? '🚂' : '👤'}</span>
                      <span>{user.name}</span>
                    </div>
                    <button onClick={handleLogout}
                      className="px-4 py-2 rounded-lg bg-neon-red/10 text-neon-red text-sm font-bold cursor-pointer">
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3.5 rounded-lg bg-neon-green/10 text-neon-green font-bold text-base">
                    🔐 Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
