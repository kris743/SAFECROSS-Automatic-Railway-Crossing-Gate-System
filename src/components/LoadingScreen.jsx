import { motion } from 'framer-motion';

const LoadingScreen = () => (
  <motion.div
    className="fixed inset-0 z-[100] bg-dark-900 flex flex-col items-center justify-center"
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative mb-8">
      {/* Outer ring */}
      <motion.div
        className="w-24 h-24 border-2 border-neon-green/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-green rounded-full" />
      </motion.div>
      {/* Inner ring */}
      <motion.div
        className="absolute inset-3 border-2 border-neon-blue/20 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-blue rounded-full" />
      </motion.div>
      {/* Center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl">🚦</span>
      </div>
    </div>

    <motion.div
      className="flex items-center gap-2"
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <span className="text-white font-bold text-xl">SAFE</span>
      <span className="text-neon-green font-bold text-xl">CROSS</span>
    </motion.div>
    <p className="text-gray-500 text-sm mt-2">Initializing Safety Systems...</p>

    {/* Loading bar */}
    <div className="w-48 h-1 bg-white/5 rounded-full mt-6 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-neon-green to-neon-blue rounded-full"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  </motion.div>
);

export default LoadingScreen;
