import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="relative mt-20 border-t border-white/5">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-neon-green/50 to-transparent" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <span className="text-xl">🚦</span>
            <span className="text-white font-extrabold">SAFE<span className="text-neon-green text-glow-green">CROSS</span></span>
          </div>
          <p className="text-gray-500 text-sm">Intelligent IoT-based railway crossing automation for accident prevention.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Navigation</h4>
          <div className="flex flex-col gap-2">
            {[['Home','/'],['Dashboard','/dashboard'],['Controls','/control'],['Project','/project']].map(([l,p])=>(
              <Link key={p} to={p} className="text-gray-500 text-sm hover:text-neon-green transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Technology</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            {['Arduino UNO','ESP32','IR Sensors','React.js','Firebase'].map(t=><span key={t}>{t}</span>)}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-gray-500">
            <span>📧 contact@safecross.io</span>
            <span>📞 +91 98765 43210</span>
            <span>🏛️ Engineering Dept.</span>
          </div>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-xs">© 2026 SAFECROSS. Final Year Engineering Project.</p>
        <motion.div className="flex items-center gap-1.5" animate={{opacity:[0.5,1,0.5]}} transition={{duration:2,repeat:Infinity}}>
          <div className="w-2 h-2 rounded-full bg-neon-green" />
          <span className="text-xs text-neon-green">System Online</span>
        </motion.div>
      </div>
    </div>
  </footer>
);

export default Footer;
