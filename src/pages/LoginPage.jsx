import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_LABELS } from '../api/mockData';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState(ROLES.USER);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const tabs = [
    { role: ROLES.USER, label: 'Public User', icon: '👤', color: 'neon-blue', desc: 'View train & crossing status' },
    { role: ROLES.RAILWAY, label: 'Railway Authority', icon: '🚂', color: 'neon-yellow', desc: 'Full system control & ESP management' },
    { role: ROLES.ADMIN, label: 'Administrator', icon: '🛡️', color: 'neon-red', desc: 'Complete system authority' },
  ];

  const activeTabData = tabs.find((t) => t.role === activeTab);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate(result.role === ROLES.USER ? '/tracking' : '/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-28 bg-grid relative overflow-hidden">
      {/* BG effects */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-green/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-[100px]" />
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute w-1 h-1 bg-neon-green/30 rounded-full"
          style={{ left: `${15 + i * 15}%`, top: `${20 + i * 10}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="text-5xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            🚦
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white">SAFE<span className="text-neon-green text-glow-green">CROSS</span> Login</h1>
          <p className="text-gray-500 text-sm mt-2">Select your role to continue</p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mb-6 p-1.5 glass rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.role}
              onClick={() => { setActiveTab(tab.role); setError(''); setEmail(''); setPassword(''); }}
              className={`flex-1 py-3 px-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.role
                  ? `bg-${tab.color}/10 border border-${tab.color}/30 text-${tab.color} shadow-[0_0_15px_rgba(255,255,255,0.05)]`
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <span className="text-lg block mb-1">{tab.icon}</span>
              <span className="block leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Login Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass-strong p-8 rounded-2xl border border-${activeTabData.color}/20 relative overflow-hidden`}
          >
            {/* Scan line */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
              <motion.div className={`absolute left-0 right-0 h-px bg-${activeTabData.color}`}
                animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
            </div>

            {/* Role Badge */}
            <div className="text-center mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-${activeTabData.color}/10 border border-${activeTabData.color}/20 text-${activeTabData.color}`}>
                {activeTabData.icon} {activeTabData.label}
              </span>
              <p className="text-gray-500 text-xs mt-2">{activeTabData.desc}</p>
            </div>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm text-center">
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-gray-400 text-sm block mb-1.5">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  placeholder={activeTab === ROLES.USER ? 'your@email.com' : `${activeTab}@safecross.io`}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40 focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all text-sm" />
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-1.5">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-green/40 focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all text-sm" />
              </div>

              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r from-${activeTabData.color}/20 to-${activeTabData.color}/10 border border-${activeTabData.color}/30 text-${activeTabData.color} font-semibold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(57,255,20,0.15)] transition-all disabled:opacity-50 cursor-pointer`}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-current/30 border-t-current rounded-full" />
                    Authenticating...
                  </span>
                ) : (
                  `🔐 Login as ${activeTabData.label}`
                )}
              </motion.button>
            </form>

            {/* Register link for public users */}
            {activeTab === ROLES.USER && (
              <div className="mt-5 text-center">
                <p className="text-gray-500 text-xs">Don't have an account?{' '}
                  <Link to="/register" className="text-neon-blue hover:underline font-medium">Register here</Link>
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginPage;
