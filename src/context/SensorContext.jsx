import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialSensorData, generateEventLog, generateChartData } from '../api/mockData';
import { database, ref, onValue, set, isFirebaseConfigured } from '../firebase';

const SensorContext = createContext(null);

export const useSensor = () => {
  const ctx = useContext(SensorContext);
  if (!ctx) throw new Error('useSensor must be used within SensorProvider');
  return ctx;
};

export const SensorProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState(initialSensorData);
  const [eventLogs, setEventLogs] = useState([]);
  const [chartData, setChartData] = useState(generateChartData(20));
  const [isSimulating, setIsSimulating] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [dataSource, setDataSource] = useState('mock'); // 'firebase' | 'mock'
  const intervalRef = useRef(null);
  const prevTrainDetectedRef = useRef(false);

  // ===== Firebase Real-Time Listener =====
  useEffect(() => {
    if (!isFirebaseConfigured() || !database) {
      setDataSource('mock');
      return;
    }

    setDataSource('firebase');
    const crossingRef = ref(database, 'crossings/CRS-001/live');

    const unsubscribe = onValue(crossingRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return; // No data yet from ESP32

      const updated = {
        irSensor: data.trainDetected || false,
        trainDetected: data.trainDetected || false,
        gateStatus: data.gateStatus || 'OPEN',
        gateAngle: data.gateAngle || 0,
        buzzerActive: data.buzzerActive || false,
        signalLight: data.signalLight || 'GREEN',
        trainSpeed: 0,
        temperature: data.temperature || '32.5',
        humidity: data.humidity || 65,
        timestamp: new Date().toISOString(),
        systemHealth: data.systemHealth || 95,
        batteryLevel: data.batteryLevel || 88,
        networkStrength: data.networkStrength || 92,
        piezoValue: data.piezoValue || 0,
        deviceId: data.deviceId || 'ESP-001',
      };

      setSensorData(updated);

      // Generate events
      const newEvents = generateEventLog(updated);
      if (newEvents.length > 0) {
        setEventLogs((prev) => [...newEvents, ...prev].slice(0, 50));
      }

      // Notifications on train state change
      if (updated.trainDetected && !prevTrainDetectedRef.current) {
        addNotification('🚂 Train Detected – Gate Closing', 'critical');
      }
      if (!updated.trainDetected && prevTrainDetectedRef.current) {
        addNotification('✅ Track Clear – Gate Opening', 'success');
      }
      prevTrainDetectedRef.current = updated.trainDetected;

      // Update chart
      setChartData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          speed: 0,
          health: updated.systemHealth,
          temperature: parseFloat(updated.temperature),
        };
        return [...prev.slice(1), newPoint];
      });
    }, (error) => {
      console.warn('Firebase listener error:', error);
      setDataSource('mock');
    });

    return () => unsubscribe();
  }, []);

  // ===== Send emergency command to ESP32 via Firebase =====
  const sendEmergencyCommand = useCallback((command) => {
    if (!isFirebaseConfigured() || !database) {
      addNotification('Firebase not configured — cannot send command', 'warning');
      return;
    }
    const cmdRef = ref(database, 'crossings/CRS-001/commands');
    set(cmdRef, { emergencyGate: command });
    addNotification(`Emergency ${command} command sent to ESP32`, 'critical');
  }, []);

  // Update sensor data manually (from control panel or simulation)
  const updateSensorData = useCallback((newData) => {
    setSensorData((prev) => {
      const updated = { ...prev, ...newData, timestamp: new Date().toISOString() };

      // Auto-logic: if train detected, close gate and activate buzzer
      if (updated.trainDetected) {
        updated.gateStatus = 'CLOSED';
        updated.gateAngle = 90;
        updated.buzzerActive = true;
        updated.signalLight = 'RED';
      }

      // Generate event logs
      const newEvents = generateEventLog(updated);
      if (newEvents.length > 0) {
        setEventLogs((prev) => [...newEvents, ...prev].slice(0, 50));
      }

      // Add notification for train detection
      if (updated.trainDetected && !prev.trainDetected) {
        addNotification('Train Approaching – Gate Closing', 'critical');
      }
      if (!updated.trainDetected && prev.trainDetected) {
        addNotification('Track Clear – Gate Opening', 'success');
      }

      return updated;
    });

    // Update chart data
    setChartData((prev) => {
      const newPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        speed: newData.trainSpeed || sensorData.trainSpeed,
        health: newData.systemHealth || sensorData.systemHealth,
        temperature: newData.temperature || sensorData.temperature,
      };
      return [...prev.slice(1), newPoint];
    });
  }, [sensorData]);

  // Add notification
  const addNotification = useCallback((message, type = 'info') => {
    const notif = { id: Date.now(), message, type, timestamp: new Date().toLocaleTimeString() };
    setNotifications((prev) => [notif, ...prev].slice(0, 10));

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    }, 5000);
  }, []);

  // Start simulation (mock mode only)
  const startSimulation = useCallback(() => {
    if (dataSource === 'firebase') {
      addNotification('Simulation disabled — using live ESP32 data', 'info');
      return;
    }
    setIsSimulating(true);
  }, [dataSource]);

  // Stop simulation
  const stopSimulation = useCallback(() => {
    setIsSimulating(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Simulation effect (only runs in mock mode)
  useEffect(() => {
    if (isSimulating && dataSource === 'mock') {
      intervalRef.current = setInterval(() => {
        const trainDetected = Math.random() > 0.6;
        const speed = trainDetected ? Math.floor(Math.random() * 120 + 60) : 0;

        updateSensorData({
          irSensor: trainDetected,
          trainDetected,
          trainSpeed: speed,
          gateStatus: trainDetected ? 'CLOSED' : 'OPEN',
          gateAngle: trainDetected ? 90 : 0,
          buzzerActive: trainDetected,
          signalLight: trainDetected ? 'RED' : 'GREEN',
          systemHealth: Math.floor(Math.random() * 15 + 82),
          batteryLevel: Math.floor(Math.random() * 20 + 75),
          networkStrength: Math.floor(Math.random() * 30 + 65),
          temperature: (Math.random() * 10 + 28).toFixed(1),
          humidity: Math.floor(Math.random() * 30 + 45),
        });
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSimulating, dataSource, updateSensorData]);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  // Export logs
  const exportLogs = useCallback(() => {
    const logData = JSON.stringify(eventLogs, null, 2);
    const blob = new Blob([logData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safecross_logs_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Logs exported successfully', 'success');
  }, [eventLogs, addNotification]);

  return (
    <SensorContext.Provider
      value={{
        sensorData,
        eventLogs,
        chartData,
        isSimulating,
        notifications,
        darkMode,
        isDarkMode: darkMode,
        dataSource,
        updateSensorData,
        startSimulation,
        stopSimulation,
        addNotification,
        toggleDarkMode,
        exportLogs,
        sendEmergencyCommand,
      }}
    >
      {children}
    </SensorContext.Provider>
  );
};

export default SensorContext;
