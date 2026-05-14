import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSensor } from '../context/SensorContext';
import { useAuth } from '../context/AuthContext';
import GaugeChart from '../components/GaugeChart';
import RailwayCrossingAnimation from '../components/RailwayCrossingAnimation';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const SensorCard = ({ label, value, unit, icon, status, color = 'green' }) => {
  const colors = {
    green: 'border-neon-green/20 text-neon-green',
    red: 'border-neon-red/20 text-neon-red',
    blue: 'border-neon-blue/20 text-neon-blue',
    yellow: 'border-neon-yellow/20 text-neon-yellow',
  };
  return (
    <motion.div variants={fadeUp} whileHover={{ y: -3 }} className={`glass p-5 rounded-xl border ${colors[color]} transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {status && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            status === 'ACTIVE' || status === 'ON' || status === 'OPEN'
              ? 'bg-neon-green/10 text-neon-green border border-neon-green/20'
              : status === 'CLOSED' || status === 'YES'
              ? 'bg-neon-red/10 text-neon-red border border-neon-red/20'
              : 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20'
          }`}>{status}</span>
        )}
      </div>
      <p className="text-white text-2xl font-bold">{value}<span className="text-sm text-gray-400 ml-1">{unit}</span></p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { sensorData, chartData, eventLogs, isSimulating, startSimulation, stopSimulation, exportLogs } = useSensor();
  const { canControl, isAdmin, isRailway, user } = useAuth();

  // Redirect if not authorized
  if (!canControl) return <Navigate to="/login" replace />;

  const signalColorClass = {
    RED: 'bg-neon-red shadow-[0_0_15px_rgba(255,7,58,0.5)]',
    GREEN: 'bg-neon-green shadow-[0_0_15px_rgba(57,255,20,0.5)]',
    YELLOW: 'bg-neon-yellow shadow-[0_0_15px_rgba(255,211,0,0.5)]',
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-grid">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">📊 Live Dashboard</h1>
            <p className="text-gray-400 text-base mt-1">Real-time railway crossing monitoring</p>
            <span className={`inline-flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full text-sm font-medium ${
              isAdmin ? 'bg-neon-red/10 border border-neon-red/20 text-neon-red' : 'bg-neon-yellow/10 border border-neon-yellow/20 text-neon-yellow'
            }`}>
              {isAdmin ? '🛡️ Admin' : '🚂 Railway'} — {user?.name}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportLogs} className="btn-neon btn-neon-blue text-sm !py-2.5 !px-5">📥 Export Logs</button>
            <button
              onClick={isSimulating ? stopSimulation : startSimulation}
              className={`btn-neon text-sm !py-2.5 !px-5 ${isSimulating ? 'btn-neon-red' : 'btn-neon-green'}`}
            >
              {isSimulating ? '⏹ Stop Simulation' : '▶ Start Simulation'}
            </button>
          </div>
        </motion.div>

        {/* Train Alert Banner */}
        {sensorData.trainDetected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 rounded-xl bg-neon-red/10 border border-neon-red/30 flex items-center gap-4 animate-blink-red"
          >
            <span className="text-2xl">🚨</span>
            <div>
              <p className="text-neon-red font-bold text-lg">TRAIN APPROACHING</p>
              <p className="text-neon-red/70 text-base">Gate closing — All crossings blocked</p>
            </div>
          </motion.div>
        )}

        {/* Sensor Cards Grid */}
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 mb-10">
          <SensorCard icon="📡" label="IR Sensor" value={sensorData.irSensor ? 'Detected' : 'Clear'} status={sensorData.irSensor ? 'ACTIVE' : 'OFF'} color={sensorData.irSensor ? 'red' : 'green'} />
          <SensorCard icon="🚂" label="Train Detection" value={sensorData.trainDetected ? 'YES' : 'NO'} status={sensorData.trainDetected ? 'YES' : 'NO'} color={sensorData.trainDetected ? 'red' : 'green'} />
          <SensorCard icon="🚧" label="Gate Status" value={sensorData.gateStatus} status={sensorData.gateStatus} color={sensorData.gateStatus === 'CLOSED' ? 'red' : 'green'} />
          <SensorCard icon="🔊" label="Buzzer" value={sensorData.buzzerActive ? 'ON' : 'OFF'} status={sensorData.buzzerActive ? 'ON' : 'OFF'} color={sensorData.buzzerActive ? 'yellow' : 'green'} />
          <SensorCard icon="🏎️" label="Train Speed" value={sensorData.trainSpeed} unit="km/h" color="blue" />
          <SensorCard icon="🌡️" label="Temperature" value={sensorData.temperature} unit="°C" color="green" />
          <SensorCard icon="💧" label="Humidity" value={sensorData.humidity} unit="%" color="blue" />
          <SensorCard icon="🔋" label="Battery" value={sensorData.batteryLevel} unit="%" color={sensorData.batteryLevel < 80 ? 'yellow' : 'green'} />
          <SensorCard icon="📶" label="Network" value={sensorData.networkStrength} unit="%" color="blue" />
        </motion.div>

        {/* Signal Light & Gauges Row */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          {/* Signal Light */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-2xl flex flex-col items-center">
            <h3 className="text-white font-semibold text-lg mb-4">Signal Light</h3>
            <div className="flex flex-col gap-3 p-4 rounded-xl bg-dark-900/50 border border-white/5">
              {['RED', 'YELLOW', 'GREEN'].map((c) => (
                <div key={c} className={`w-12 h-12 rounded-full transition-all duration-300 ${sensorData.signalLight === c ? signalColorClass[c] : 'bg-gray-800'}`} />
              ))}
            </div>
            <p className="text-gray-400 text-base mt-3">Current: <span className={`font-bold ${sensorData.signalLight === 'RED' ? 'text-neon-red' : sensorData.signalLight === 'GREEN' ? 'text-neon-green' : 'text-neon-yellow'}`}>{sensorData.signalLight}</span></p>
          </motion.div>

          {/* Gauges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-2xl">
            <h3 className="text-white font-semibold text-lg mb-4 text-center">System Gauges</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative flex justify-center"><GaugeChart value={sensorData.trainSpeed} max={200} label="Speed (km/h)" color="#00f0ff" size={120} /></div>
              <div className="relative flex justify-center"><GaugeChart value={sensorData.systemHealth} max={100} label="Health (%)" color="#39ff14" size={120} /></div>
            </div>
          </motion.div>

          {/* Crossing Animation */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6 rounded-2xl">
            <h3 className="text-white font-semibold text-lg mb-3 text-center">Crossing View</h3>
            <RailwayCrossingAnimation gateStatus={sensorData.gateStatus} trainDetected={sensorData.trainDetected} />
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-2xl">
            <h3 className="text-white font-semibold text-lg mb-4">Speed Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/><stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#666', fontSize: 10 }} />
                <YAxis tick={{ fill: '#666', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="speed" stroke="#00f0ff" fill="url(#colorDist)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-2xl">
            <h3 className="text-white font-semibold text-lg mb-4">System Health Over Time</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#666', fontSize: 10 }} />
                <YAxis tick={{ fill: '#666', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="health" stroke="#39ff14" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Event Logs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-2xl">
          <h3 className="text-white font-semibold text-lg mb-4">Event Logs</h3>
          <div className="max-h-72 overflow-y-auto space-y-3 pr-2">
            {eventLogs.length === 0 ? (
              <p className="text-gray-500 text-base text-center py-8">No events yet. Start simulation to see logs.</p>
            ) : (
              eventLogs.map((log) => (
                <div key={log.id} className={`flex items-center gap-3 p-3 rounded-lg border ${
                  log.severity === 'critical' ? 'bg-neon-red/5 border-neon-red/20' :
                  log.severity === 'warning' ? 'bg-neon-yellow/5 border-neon-yellow/20' :
                  'bg-white/[0.02] border-white/5'
                }`}>
                  <span className="text-lg">{log.type === 'ALERT' ? '🚨' : log.type === 'WARNING' ? '⚠️' : 'ℹ️'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-white truncate">{log.message}</p>
                  </div>
                  <span className="text-sm text-gray-500 shrink-0">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Timestamp */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">Last Updated: {new Date(sensorData.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
