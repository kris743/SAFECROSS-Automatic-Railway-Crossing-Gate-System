import { motion } from 'framer-motion';

const RailwayCrossingAnimation = ({ gateStatus = 'OPEN', trainDetected = false }) => {
  const isClosed = gateStatus === 'CLOSED';

  return (
    <div className="relative w-full max-w-lg mx-auto h-48 overflow-hidden rounded-xl border border-white/5 bg-dark-800/50">
      {/* Track */}
      <div className="absolute bottom-12 left-0 right-0 h-3 bg-gray-700">
        <div className="absolute inset-0 flex items-center justify-around">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="w-6 h-1 bg-gray-500 rounded" />
          ))}
        </div>
      </div>
      {/* Rails */}
      <div className="absolute bottom-10 left-0 right-0 h-0.5 bg-gray-400" />
      <div className="absolute bottom-16 left-0 right-0 h-0.5 bg-gray-400" />

      {/* Train */}
      {trainDetected && (
        <motion.div
          className="absolute bottom-10 h-10"
          animate={{ x: ['calc(-120px)', 'calc(100vw)'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div className="flex items-end">
            <div className="w-16 h-10 bg-gradient-to-r from-gray-600 to-gray-500 rounded-t-lg relative">
              <div className="absolute top-1 left-2 w-3 h-3 rounded-full bg-neon-yellow animate-pulse-glow" />
              <div className="absolute top-1 right-2 w-3 h-3 rounded-full bg-neon-yellow animate-pulse-glow" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-12 h-8 bg-gradient-to-b from-gray-500 to-gray-600 border-l border-gray-400 flex items-center justify-center">
                <div className="w-4 h-3 border border-gray-300 rounded-sm bg-blue-900/30" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Gate Left */}
      <div className="absolute bottom-16 left-[25%]">
        <div className="w-2 h-20 bg-gray-500 rounded-t" />
        <motion.div
          className="absolute top-0 left-2 origin-left"
          animate={{ rotate: isClosed ? -90 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <div className="w-24 h-2 bg-gradient-to-r from-neon-red to-white rounded flex items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-4 h-2 ${i % 2 === 0 ? 'bg-neon-red' : 'bg-white'}`} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Gate Right */}
      <div className="absolute bottom-16 right-[25%]">
        <div className="w-2 h-20 bg-gray-500 rounded-t" />
        <motion.div
          className="absolute top-0 right-2 origin-right"
          animate={{ rotate: isClosed ? 90 : 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <div className="w-24 h-2 bg-gradient-to-l from-neon-red to-white rounded flex items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-4 h-2 ${i % 2 === 0 ? 'bg-neon-red' : 'bg-white'}`} />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Signal Lights */}
      <div className="absolute top-4 left-[25%] flex flex-col items-center gap-1">
        <motion.div
          className="w-4 h-4 rounded-full bg-neon-red"
          animate={isClosed ? { opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] } : { opacity: 0.2 }}
          transition={{ duration: 0.5, repeat: isClosed ? Infinity : 0 }}
        />
        <div className={`w-4 h-4 rounded-full ${!isClosed ? 'bg-neon-green' : 'bg-green-900/30'}`} />
      </div>
      <div className="absolute top-4 right-[25%] flex flex-col items-center gap-1">
        <motion.div
          className="w-4 h-4 rounded-full bg-neon-red"
          animate={isClosed ? { opacity: [1, 0.3, 1], scale: [1.2, 1, 1.2] } : { opacity: 0.2 }}
          transition={{ duration: 0.5, repeat: isClosed ? Infinity : 0 }}
        />
        <div className={`w-4 h-4 rounded-full ${!isClosed ? 'bg-neon-green' : 'bg-green-900/30'}`} />
      </div>

      {/* Status Label */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2">
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          isClosed
            ? 'bg-neon-red/10 border-neon-red/30 text-neon-red animate-blink-red'
            : 'bg-neon-green/10 border-neon-green/30 text-neon-green'
        }`}>
          {isClosed ? '⛔ GATE CLOSED' : '✅ GATE OPEN'}
        </span>
      </div>
    </div>
  );
};

export default RailwayCrossingAnimation;
