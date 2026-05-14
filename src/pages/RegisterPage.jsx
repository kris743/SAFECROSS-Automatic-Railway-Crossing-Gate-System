import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }

    const result = await register(name, email, password);
    if (result.success) {
      navigate('/tracking');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-28 bg-grid relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-neon-blue/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-green/5 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Card */}
        <div className="glass-strong p-10 rounded-2xl glow-blue relative overflow-hidden">
          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <motion.div className="absolute left-0 right-0 h-px bg-neon-blue"
              animate={{ top: ['0%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center mb-4">
              <span className="text-2xl">👤</span>
            </div>
            <h1 className="text-xl font-bold text-white">Create Your Account</h1>
            <p className="text-gray-400 text-sm mt-1">Register as a public user to track train positions</p>
            <span className="inline-block mt-3 px-3 py-1 rounded-full text-[10px] font-medium bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
              👤 Public User Account
            </span>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 rounded-lg bg-neon-red/10 border border-neon-red/20 text-neon-red text-sm text-center">
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm" />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm" />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm" />
            </div>

            <div>
              <label className="text-gray-400 text-sm block mb-1.5">Confirm Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                placeholder="Re-enter password"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-neon-blue/40 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all text-sm" />
            </div>

            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-blue/20 to-neon-green/10 border border-neon-blue/30 text-neon-blue font-semibold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] transition-all disabled:opacity-50 cursor-pointer">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-4 h-4 border-2 border-neon-blue/30 border-t-neon-blue rounded-full" />
                  Creating account...
                </span>
              ) : '👤 Create Account'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">Already have an account?{' '}
              <Link to="/login" className="text-neon-green hover:underline font-medium">Login here</Link>
            </p>
          </div>

          {/* What you get */}
          <div className="mt-6 p-4 rounded-lg bg-white/[0.02] border border-white/5">
            <p className="text-gray-500 text-xs font-medium mb-3">As a Public User, you can:</p>
            <ul className="text-gray-400 text-xs space-y-2">
              <li>✅ View live train positions near crossings</li>
              <li>✅ Check which crossing a train is approaching</li>
              <li>✅ See crossing gate status (Open/Closed)</li>
              <li>✅ Get safety alerts and notifications</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
