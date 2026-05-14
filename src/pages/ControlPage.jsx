import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useSensor } from '../context/SensorContext';
import { useAuth } from '../context/AuthContext';

const ControlPage = () => {
  const { sensorData, updateSensorData, addNotification, isSimulating, stopSimulation } = useSensor();
  const { canControl, isAdmin, isRailway, user } = useAuth();

  // Redirect if not authorized
  if (!canControl) return <Navigate to="/login" replace />;
  const [form, setForm] = useState({
    trainDetected: sensorData.trainDetected,
    trainSpeed: sensorData.trainSpeed,
    gateAngle: sensorData.gateAngle,
    buzzerActive: sensorData.buzzerActive,
    signalLight: sensorData.signalLight,
  });

  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSimulating) stopSimulation();
    updateSensorData({
      ...form,
      gateStatus: form.gateAngle > 45 ? 'CLOSED' : 'OPEN',
      irSensor: form.trainDetected,
    });
    addNotification('Sensor data updated successfully', 'success');
  };

  const handleEmergencyStop = () => {
    if (isSimulating) stopSimulation();
    updateSensorData({
      trainDetected: false, trainSpeed: 0,
      gateStatus: 'CLOSED', gateAngle: 90, buzzerActive: true,
      signalLight: 'RED', irSensor: false,
    });
    addNotification('🚨 EMERGENCY STOP ACTIVATED', 'critical');
  };

  const Toggle = ({ checked, onChange, label, activeColor = 'bg-neon-green' }) => (
    <div className="flex items-center justify-between">
      <span className="text-gray-300 text-base">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-14 h-7 rounded-full transition-colors ${checked ? activeColor : 'bg-gray-700'}`}
      >
        <motion.div
          className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow"
          animate={{ left: checked ? '30px' : '2px' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-grid">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">🎛️ Sensor Control Panel</h1>
          <p className="text-gray-400 text-base mb-4">Manually configure and simulate IoT sensor data</p>
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
            isAdmin ? 'bg-neon-red/10 border border-neon-red/20 text-neon-red' : 'bg-neon-yellow/10 border border-neon-yellow/20 text-neon-yellow'
          }`}>
            {isAdmin ? '🛡️ Administrator' : '🚂 Railway Authority'} — {user?.name}
          </span>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {/* Detection Controls */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-2xl space-y-6">
              <h3 className="text-white font-semibold text-xl flex items-center gap-2">📡 Detection Controls</h3>
              <Toggle label="Train Detected" checked={form.trainDetected} onChange={(v) => handleChange('trainDetected', v)} activeColor="bg-neon-red" />
              <div>
                <label className="text-gray-400 text-base block mb-2">Train Speed: <span className="text-neon-green font-bold text-lg">{form.trainSpeed} km/h</span></label>
                <input type="range" min="0" max="200" value={form.trainSpeed} onChange={(e) => handleChange('trainSpeed', +e.target.value)}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #39ff14 ${form.trainSpeed / 2}%, #1a1a2e ${form.trainSpeed / 2}%)` }} />
                <div className="flex justify-between text-sm text-gray-600 mt-1"><span>0</span><span>200 km/h</span></div>
              </div>
            </motion.div>

            {/* Gate & Alert Controls */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass p-8 rounded-2xl space-y-6">
              <h3 className="text-white font-semibold text-xl flex items-center gap-2">🚧 Gate & Alert Controls</h3>
              <div>
                <label className="text-gray-400 text-base block mb-2">Gate Angle: <span className="text-neon-yellow font-bold text-lg">{form.gateAngle}°</span>
                  <span className="ml-2 text-sm">({form.gateAngle > 45 ? 'CLOSED' : 'OPEN'})</span>
                </label>
                <input type="range" min="0" max="90" value={form.gateAngle} onChange={(e) => handleChange('gateAngle', +e.target.value)}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #ffd300 ${form.gateAngle / 0.9}%, #1a1a2e ${form.gateAngle / 0.9}%)` }} />
                <div className="flex justify-between text-sm text-gray-600 mt-1"><span>0° (Open)</span><span>90° (Closed)</span></div>
              </div>
              <Toggle label="Buzzer Active" checked={form.buzzerActive} onChange={(v) => handleChange('buzzerActive', v)} activeColor="bg-neon-yellow" />
              <div>
                <label className="text-gray-400 text-base block mb-3">Signal Light Color</label>
                <div className="flex gap-4">
                  {['RED', 'YELLOW', 'GREEN'].map((c) => (
                    <button key={c} type="button" onClick={() => handleChange('signalLight', c)}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                        form.signalLight === c
                          ? c === 'RED' ? 'bg-neon-red/20 text-neon-red border border-neon-red/40 shadow-[0_0_15px_rgba(255,7,58,0.3)]'
                            : c === 'GREEN' ? 'bg-neon-green/20 text-neon-green border border-neon-green/40 shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                            : 'bg-neon-yellow/20 text-neon-yellow border border-neon-yellow/40 shadow-[0_0_15px_rgba(255,211,0,0.3)]'
                          : 'bg-white/5 text-gray-500 border border-white/5'
                      }`}
                    >{c}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 btn-filled-green text-center !rounded-xl !py-4 text-lg font-semibold">
              ✅ Update Dashboard
            </motion.button>
            <motion.button type="button" onClick={handleEmergencyStop} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-4 rounded-xl bg-neon-red/10 border-2 border-neon-red/40 text-neon-red font-bold text-lg uppercase tracking-wider hover:bg-neon-red/20 hover:shadow-[0_0_30px_rgba(255,7,58,0.3)] transition-all cursor-pointer">
              🚨 Emergency Stop
            </motion.button>
          </div>
        </form>

        {/* Current State */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 glass p-8 rounded-2xl">
          <h3 className="text-white font-semibold text-lg mb-5">Current System State</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { label: 'Gate', value: sensorData.gateStatus, color: sensorData.gateStatus === 'OPEN' ? 'text-neon-green' : 'text-neon-red' },
              { label: 'Train', value: sensorData.trainDetected ? 'DETECTED' : 'CLEAR', color: sensorData.trainDetected ? 'text-neon-red' : 'text-neon-green' },
              { label: 'Signal', value: sensorData.signalLight, color: sensorData.signalLight === 'RED' ? 'text-neon-red' : sensorData.signalLight === 'GREEN' ? 'text-neon-green' : 'text-neon-yellow' },
              { label: 'Buzzer', value: sensorData.buzzerActive ? 'ON' : 'OFF', color: sensorData.buzzerActive ? 'text-neon-yellow' : 'text-gray-400' },
            ].map((item) => (
              <div key={item.label} className="p-5 rounded-lg bg-white/[0.02] border border-white/5 text-center">
                <p className="text-gray-500 text-sm mb-1">{item.label}</p>
                <p className={`font-bold text-xl ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ControlPage;
