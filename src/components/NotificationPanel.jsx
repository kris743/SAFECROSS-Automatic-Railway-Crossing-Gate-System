import { motion, AnimatePresence } from 'framer-motion';
import { useSensor } from '../context/SensorContext';

const NotificationPanel = () => {
  const { notifications } = useSensor();

  const typeStyles = {
    critical: 'border-neon-red/40 bg-neon-red/5 text-neon-red',
    warning: 'border-neon-yellow/40 bg-neon-yellow/5 text-neon-yellow',
    success: 'border-neon-green/40 bg-neon-green/5 text-neon-green',
    info: 'border-neon-blue/40 bg-neon-blue/5 text-neon-blue',
  };

  const typeIcons = { critical: '🚨', warning: '⚠️', success: '✅', info: 'ℹ️' };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className={`pointer-events-auto glass p-4 border rounded-xl ${typeStyles[notif.type] || typeStyles.info}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl">{typeIcons[notif.type] || '📌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notif.message}</p>
                <p className="text-xs opacity-60 mt-1">{notif.timestamp}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;
