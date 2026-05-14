import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useSensor } from '../context/SensorContext';
import { espDevices as initialDevices, generateErrorLogs, crossings } from '../api/mockData';
import { Navigate } from 'react-router-dom';

const ESPManagementPage = () => {
  const { canManageESP, isRailway, isAdmin, user } = useAuth();
  const { addNotification } = useSensor();

  const [devices, setDevices] = useState(initialDevices);
  const [errors, setErrors] = useState(generateErrorLogs());
  const [editingDevice, setEditingDevice] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState('devices');
  const [showRebootConfirm, setShowRebootConfirm] = useState(null);

  // Redirect if not authorized
  if (!canManageESP) return <Navigate to="/login" replace />;

  const handleReboot = (deviceId) => {
    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, status: 'rebooting' } : d
    ));
    addNotification(`🔄 Rebooting ${deviceId}...`, 'warning');
    setShowRebootConfirm(null);

    setTimeout(() => {
      setDevices((prev) => prev.map((d) =>
        d.id === deviceId ? { ...d, status: 'online', lastPing: Date.now() } : d
      ));
      addNotification(`✅ ${deviceId} rebooted successfully`, 'success');
    }, 3000);
  };

  const handleUpdateFirmware = (deviceId) => {
    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, firmware: 'v2.4.1', status: 'updating' } : d
    ));
    addNotification(`📦 Updating firmware on ${deviceId}...`, 'info');

    setTimeout(() => {
      setDevices((prev) => prev.map((d) =>
        d.id === deviceId ? { ...d, status: 'online', firmware: 'v2.4.1' } : d
      ));
      addNotification(`✅ ${deviceId} firmware updated to v2.4.1`, 'success');
      setErrors((prev) => prev.filter((e) => !(e.device === deviceId && e.type === 'FIRMWARE_OUTDATED')));
    }, 4000);
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device.id);
    setEditForm({ name: device.name, ip: device.ip, crossing: device.crossing });
  };

  const handleSaveEdit = (deviceId) => {
    setDevices((prev) => prev.map((d) =>
      d.id === deviceId ? { ...d, ...editForm } : d
    ));
    setEditingDevice(null);
    addNotification(`✅ ${deviceId} configuration updated`, 'success');
  };

  const handleResolveError = (errId) => {
    setErrors((prev) => prev.map((e) =>
      e.id === errId ? { ...e, resolved: true } : e
    ));
    addNotification('Error marked as resolved', 'success');
  };

  const handleDismissError = (errId) => {
    setErrors((prev) => prev.filter((e) => e.id !== errId));
    addNotification('Error dismissed', 'info');
  };

  const statusColors = {
    online: 'bg-neon-green text-neon-green',
    offline: 'bg-neon-red text-neon-red',
    warning: 'bg-neon-yellow text-neon-yellow',
    rebooting: 'bg-neon-blue text-neon-blue',
    updating: 'bg-neon-purple text-neon-purple',
  };

  const severityColors = {
    critical: 'border-neon-red/30 bg-neon-red/5',
    warning: 'border-neon-yellow/30 bg-neon-yellow/5',
    info: 'border-neon-blue/30 bg-neon-blue/5',
  };

  const unresolvedCount = errors.filter((e) => !e.resolved).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-grid">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">⚙️ ESP32 Management</h1>
              <p className="text-gray-400 text-sm mt-1">
                {isAdmin ? '🛡️ Administrator Access' : '🚂 Railway Authority Access'} — {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-neon-green/10 border border-neon-green/20 text-neon-green">
                {devices.filter((d) => d.status === 'online').length}/{devices.length} Online
              </span>
              {unresolvedCount > 0 && (
                <span className="text-xs px-3 py-1.5 rounded-full bg-neon-red/10 border border-neon-red/20 text-neon-red animate-pulse-glow">
                  {unresolvedCount} Errors
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {[
            { key: 'devices', label: '📟 ESP Devices', count: devices.length },
            { key: 'errors', label: '⚠️ Error Logs', count: unresolvedCount },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-neon-green/10 border border-neon-green/20 text-neon-green'
                  : 'glass text-gray-400 hover:text-white'
              }`}>
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                  tab.key === 'errors' && tab.count > 0
                    ? 'bg-neon-red/20 text-neon-red'
                    : 'bg-white/10 text-gray-400'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* DEVICES TAB */}
        {activeTab === 'devices' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            {devices.map((device) => {
              const crossing = crossings.find((c) => c.id === device.crossing);
              const isEditing = editingDevice === device.id;

              return (
                <div key={device.id} className={`glass p-6 rounded-xl border ${
                  device.status === 'offline' ? 'border-neon-red/20' :
                  device.status === 'warning' ? 'border-neon-yellow/20' : 'border-white/5'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Device Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                        <span className="text-xl">📟</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-2">
                            <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-green/40" />
                            <input value={editForm.ip} onChange={(e) => setEditForm({ ...editForm, ip: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-neon-green/40"
                              placeholder="IP Address" />
                            <select value={editForm.crossing} onChange={(e) => setEditForm({ ...editForm, crossing: e.target.value })}
                              className="w-full px-3 py-1.5 rounded-lg bg-dark-800 border border-white/10 text-white text-sm focus:outline-none">
                              {crossings.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-white font-semibold">{device.name}</h3>
                              <span className="text-xs text-gray-600 font-mono">{device.id}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColors[device.status]} bg-opacity-10 border border-current/20 font-medium`}>
                                {device.status === 'rebooting' ? '🔄 Rebooting...' :
                                 device.status === 'updating' ? '📦 Updating...' :
                                 device.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs mt-1">
                              📍 {crossing?.name || device.crossing} • 🌐 {device.ip} • 📦 {device.firmware}
                            </p>
                            <p className="text-gray-600 text-xs mt-0.5">
                              Last ping: {new Date(device.lastPing).toLocaleTimeString()}
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      {isEditing ? (
                        <>
                          <button onClick={() => handleSaveEdit(device.id)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 transition-colors cursor-pointer">
                            ✅ Save
                          </button>
                          <button onClick={() => setEditingDevice(null)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer">
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditDevice(device)}
                            className="px-3 py-1.5 text-xs rounded-lg bg-neon-blue/10 border border-neon-blue/20 text-neon-blue hover:bg-neon-blue/20 transition-colors cursor-pointer">
                            ✏️ Edit
                          </button>
                          {device.firmware !== 'v2.4.1' && (
                            <button onClick={() => handleUpdateFirmware(device.id)}
                              disabled={device.status === 'updating'}
                              className="px-3 py-1.5 text-xs rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple/20 transition-colors disabled:opacity-40 cursor-pointer">
                              📦 Update
                            </button>
                          )}
                          <button onClick={() => setShowRebootConfirm(device.id)}
                            disabled={device.status === 'offline' || device.status === 'rebooting'}
                            className="px-3 py-1.5 text-xs rounded-lg bg-neon-yellow/10 border border-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/20 transition-colors disabled:opacity-40 cursor-pointer">
                            🔄 Reboot
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Reboot Confirmation */}
                  <AnimatePresence>
                    {showRebootConfirm === device.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-white/5">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-neon-yellow/5 border border-neon-yellow/20">
                          <p className="text-neon-yellow text-xs">⚠️ Confirm reboot of {device.name}? Device will be offline for ~10 seconds.</p>
                          <div className="flex gap-2 shrink-0 ml-4">
                            <button onClick={() => handleReboot(device.id)}
                              className="px-3 py-1 text-xs rounded-lg bg-neon-yellow/20 text-neon-yellow hover:bg-neon-yellow/30 cursor-pointer">Yes, Reboot</button>
                            <button onClick={() => setShowRebootConfirm(null)}
                              className="px-3 py-1 text-xs rounded-lg bg-white/5 text-gray-400 hover:text-white cursor-pointer">Cancel</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ERRORS TAB */}
        {activeTab === 'errors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {errors.length === 0 ? (
              <div className="glass p-10 rounded-xl text-center">
                <span className="text-4xl block mb-3">✅</span>
                <p className="text-gray-400">No errors found. All systems operational.</p>
              </div>
            ) : (
              errors.map((err) => (
                <div key={err.id}
                  className={`glass p-5 rounded-xl border ${severityColors[err.severity]} ${err.resolved ? 'opacity-50' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl shrink-0">
                        {err.severity === 'critical' ? '🔴' : err.severity === 'warning' ? '🟡' : '🔵'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono text-gray-500">{err.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400">{err.type}</span>
                          <span className="text-xs text-gray-600">📟 {err.device}</span>
                          {err.resolved && <span className="text-xs text-neon-green">✅ Resolved</span>}
                        </div>
                        <p className="text-white text-sm mt-1">{err.message}</p>
                        <p className="text-gray-600 text-xs mt-1">
                          {new Date(err.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {!err.resolved && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleResolveError(err.id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-neon-green/10 border border-neon-green/20 text-neon-green hover:bg-neon-green/20 cursor-pointer">
                          ✅ Resolve
                        </button>
                        <button onClick={() => handleDismissError(err.id)}
                          className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white cursor-pointer">
                          ✕ Dismiss
                        </button>
                        {err.type === 'FIRMWARE_OUTDATED' && (
                          <button onClick={() => { handleUpdateFirmware(err.device); handleResolveError(err.id); }}
                            className="px-3 py-1.5 text-xs rounded-lg bg-neon-purple/10 border border-neon-purple/20 text-neon-purple hover:bg-neon-purple/20 cursor-pointer">
                            📦 Update Firmware
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ESPManagementPage;
