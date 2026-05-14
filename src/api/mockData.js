// ===== SAFECROSS Mock Data & API Simulation =====

// ===== ROLE DEFINITIONS =====
export const ROLES = {
  USER: 'user',           // Normal public user - view only
  RAILWAY: 'railway',     // Railway authority - full control
  ADMIN: 'admin',         // Administrator - full authority
};

export const ROLE_LABELS = {
  [ROLES.USER]: 'Public User',
  [ROLES.RAILWAY]: 'Railway Authority',
  [ROLES.ADMIN]: 'Administrator',
};

export const ROLE_COLORS = {
  [ROLES.USER]: { bg: 'bg-neon-blue/10', border: 'border-neon-blue/30', text: 'text-neon-blue' },
  [ROLES.RAILWAY]: { bg: 'bg-neon-yellow/10', border: 'border-neon-yellow/30', text: 'text-neon-yellow' },
  [ROLES.ADMIN]: { bg: 'bg-neon-red/10', border: 'border-neon-red/30', text: 'text-neon-red' },
};

// ===== CROSSING LOCATIONS =====
export const crossings = [
  { id: 'CRS-001', name: 'Rajpur Junction Crossing', location: 'NH-44, KM 125.3', lat: 28.6139, lng: 77.2090, status: 'active' },
  { id: 'CRS-002', name: 'Lalganj Level Crossing', location: 'SH-12, KM 48.7', lat: 25.3176, lng: 82.9739, status: 'active' },
  { id: 'CRS-003', name: 'Shivpur Railway Gate', location: 'District Road, KM 9.2', lat: 25.2677, lng: 82.9913, status: 'active' },
  { id: 'CRS-004', name: 'Mugalsarai East Crossing', location: 'NH-2, KM 302.1', lat: 25.2832, lng: 83.1198, status: 'maintenance' },
  { id: 'CRS-005', name: 'Chandauli West Gate', location: 'SH-5A, KM 15.6', lat: 25.2584, lng: 83.2636, status: 'active' },
  { id: 'CRS-006', name: 'Paharia Junction Gate', location: 'Local Road, KM 3.1', lat: 25.3396, lng: 83.0087, status: 'active' },
];

// ===== TRAIN SCHEDULE — fixed trains with routes through crossings =====
export const trainSchedule = [
  {
    trainId: 'TRN-12301', trainName: 'Rajdhani Express', trainNumber: '12301',
    route: ['CRS-001', 'CRS-002', 'CRS-003', 'CRS-005'],
    from: 'New Delhi', to: 'Howrah',
    departureTime: '16:55', arrivalTime: '09:55',
    type: 'Superfast', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainId: 'TRN-12559', trainName: 'Shiv Ganga Express', trainNumber: '12559',
    route: ['CRS-002', 'CRS-003', 'CRS-006'],
    from: 'New Delhi', to: 'Varanasi',
    departureTime: '18:55', arrivalTime: '06:40',
    type: 'Superfast', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainId: 'TRN-22436', trainName: 'Vande Bharat Express', trainNumber: '22436',
    route: ['CRS-001', 'CRS-003', 'CRS-005', 'CRS-006'],
    from: 'Varanasi', to: 'New Delhi',
    departureTime: '15:00', arrivalTime: '21:00',
    type: 'Semi High-Speed', days: ['Mon', 'Wed', 'Fri'],
  },
  {
    trainId: 'TRN-14258', trainName: 'Kashi Vishwanath Express', trainNumber: '14258',
    route: ['CRS-001', 'CRS-002', 'CRS-004', 'CRS-006'],
    from: 'Delhi', to: 'Varanasi',
    departureTime: '23:45', arrivalTime: '16:15',
    type: 'Express', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainId: 'TRN-15017', trainName: 'Gorakhpur Express', trainNumber: '15017',
    route: ['CRS-002', 'CRS-005', 'CRS-006'],
    from: 'Gorakhpur', to: 'Kolkata',
    departureTime: '08:30', arrivalTime: '22:00',
    type: 'Express', days: ['Tue', 'Thu', 'Sat'],
  },
  {
    trainId: 'TRN-12381', trainName: 'Poorva Express', trainNumber: '12381',
    route: ['CRS-001', 'CRS-003', 'CRS-004', 'CRS-005'],
    from: 'New Delhi', to: 'Howrah',
    departureTime: '20:05', arrivalTime: '20:35',
    type: 'Superfast', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainId: 'TRN-11045', trainName: 'Deshbandhu Express', trainNumber: '11045',
    route: ['CRS-003', 'CRS-004', 'CRS-006'],
    from: 'LTT Mumbai', to: 'Howrah',
    departureTime: '10:05', arrivalTime: '14:30',
    type: 'Express', days: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
  {
    trainId: 'TRN-13005', trainName: 'Amritsar Mail', trainNumber: '13005',
    route: ['CRS-001', 'CRS-002', 'CRS-005'],
    from: 'Amritsar', to: 'Howrah',
    departureTime: '22:00', arrivalTime: '05:30',
    type: 'Mail', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
];

// Get trains that pass through a specific crossing
export const getTrainsForCrossing = (crossingId) =>
  trainSchedule.filter((t) => t.route.includes(crossingId));

// Simulate live status for a train near a crossing (random but realistic)
export const getTrainLiveStatus = (trainId, crossingId) => {
  // Deterministic seed based on current minute + trainId for consistent status within a minute
  const now = new Date();
  const seed = now.getMinutes() + trainId.charCodeAt(4);
  const isNear = seed % 4 === 0; // ~25% chance the train is currently near
  const distanceKm = isNear ? +(Math.random() * 3 + 0.2).toFixed(1) : +(Math.random() * 50 + 5).toFixed(1);
  const approaching = distanceKm < 2;
  const avgSpeed = 80; // average speed for ETA calculation
  const eta = approaching ? `${Math.max(1, Math.floor(distanceKm * 60 / avgSpeed))} min` : distanceKm < 10 ? `${Math.floor(distanceKm * 60 / avgSpeed)} min` : 'N/A';

  return {
    trainId,
    crossingId,
    distanceKm,
    approaching,
    direction: seed % 2 === 0 ? 'Northbound' : 'Southbound',
    eta,
    lastUpdated: now.toLocaleTimeString(),
    isNear,
    status: approaching ? 'AT_CROSSING' : isNear ? 'NEAR' : 'FAR',
  };
};

// Get live status for ALL trains passing through a specific crossing
export const getCrossingLiveStatus = (crossingId) => {
  const trains = getTrainsForCrossing(crossingId);
  return trains.map((t) => ({
    ...t,
    live: getTrainLiveStatus(t.trainId, crossingId),
  }));
};

// ===== ESP32 DEVICE CONFIGURATION =====
export const espDevices = [
  { id: 'ESP-001', name: 'ESP32 Node Alpha', crossing: 'CRS-001', firmware: 'v2.4.1', status: 'online', ip: '192.168.1.101', lastPing: Date.now() - 5000 },
  { id: 'ESP-002', name: 'ESP32 Node Beta', crossing: 'CRS-002', firmware: 'v2.4.1', status: 'online', ip: '192.168.1.102', lastPing: Date.now() - 3000 },
  { id: 'ESP-003', name: 'ESP32 Node Gamma', crossing: 'CRS-003', firmware: 'v2.3.8', status: 'online', ip: '192.168.1.103', lastPing: Date.now() - 12000 },
  { id: 'ESP-004', name: 'ESP32 Node Delta', crossing: 'CRS-004', firmware: 'v2.2.5', status: 'offline', ip: '192.168.1.104', lastPing: Date.now() - 300000 },
  { id: 'ESP-005', name: 'ESP32 Node Epsilon', crossing: 'CRS-005', firmware: 'v2.4.1', status: 'online', ip: '192.168.1.105', lastPing: Date.now() - 8000 },
  { id: 'ESP-006', name: 'ESP32 Node Zeta', crossing: 'CRS-006', firmware: 'v2.4.0', status: 'warning', ip: '192.168.1.106', lastPing: Date.now() - 45000 },
];

// ===== ERROR LOGS =====
export const generateErrorLogs = () => [
  { id: 'ERR-001', device: 'ESP-004', type: 'CONNECTION_LOST', message: 'Device offline — no heartbeat for 5 min', severity: 'critical', timestamp: new Date(Date.now() - 300000).toISOString(), resolved: false },
  { id: 'ERR-002', device: 'ESP-006', type: 'SENSOR_DRIFT', message: 'IR sensor reading inconsistent', severity: 'warning', timestamp: new Date(Date.now() - 45000).toISOString(), resolved: false },
  { id: 'ERR-003', device: 'ESP-001', type: 'LOW_BATTERY', message: 'Backup battery below 20%', severity: 'warning', timestamp: new Date(Date.now() - 120000).toISOString(), resolved: false },
  { id: 'ERR-004', device: 'ESP-003', type: 'FIRMWARE_OUTDATED', message: 'Firmware v2.3.8 — update available (v2.4.1)', severity: 'info', timestamp: new Date(Date.now() - 600000).toISOString(), resolved: false },
  { id: 'ERR-005', device: 'ESP-002', type: 'GATE_STUCK', message: 'Gate servo motor stall detected (recovered)', severity: 'warning', timestamp: new Date(Date.now() - 900000).toISOString(), resolved: true },
];

// Generate random sensor data for simulation
export const generateSensorData = () => ({
  irSensor: Math.random() > 0.5,
  trainDetected: Math.random() > 0.7,
  gateStatus: Math.random() > 0.5 ? 'OPEN' : 'CLOSED',
  gateAngle: Math.floor(Math.random() * 90),
  buzzerActive: Math.random() > 0.6,
  signalLight: ['RED', 'GREEN', 'YELLOW'][Math.floor(Math.random() * 3)],
  trainSpeed: Math.floor(Math.random() * 180) + 20,
  temperature: (Math.random() * 15 + 25).toFixed(1),
  humidity: Math.floor(Math.random() * 40 + 40),
  timestamp: new Date().toISOString(),
  systemHealth: Math.floor(Math.random() * 20 + 80),
  batteryLevel: Math.floor(Math.random() * 30 + 70),
  networkStrength: Math.floor(Math.random() * 40 + 60),
});

// Initial sensor state (safe mode)
export const initialSensorData = {
  irSensor: false,
  trainDetected: false,
  gateStatus: 'OPEN',
  gateAngle: 0,
  buzzerActive: false,
  signalLight: 'GREEN',
  trainSpeed: 0,
  temperature: '32.5',
  humidity: 65,
  timestamp: new Date().toISOString(),
  systemHealth: 95,
  batteryLevel: 88,
  networkStrength: 92,
};

// Event log entries
export const generateEventLog = (sensorData) => {
  const events = [];
  if (sensorData.trainDetected) {
    events.push({ id: Date.now(), type: 'ALERT', message: 'Train Approaching – Gate Closing', timestamp: new Date().toLocaleTimeString(), severity: 'critical' });
  }
  if (sensorData.gateStatus === 'CLOSED') {
    events.push({ id: Date.now() + 1, type: 'INFO', message: 'Gate Secured – Crossing Blocked', timestamp: new Date().toLocaleTimeString(), severity: 'warning' });
  }
  if (sensorData.buzzerActive) {
    events.push({ id: Date.now() + 2, type: 'WARNING', message: 'Buzzer Activated – Warning Pedestrians', timestamp: new Date().toLocaleTimeString(), severity: 'warning' });
  }
  if (sensorData.systemHealth < 85) {
    events.push({ id: Date.now() + 3, type: 'SYSTEM', message: 'System Health Below Threshold', timestamp: new Date().toLocaleTimeString(), severity: 'info' });
  }
  return events;
};

// Historical chart data
export const generateChartData = (count = 20) => {
  const data = [];
  const now = Date.now();
  for (let i = count; i >= 0; i--) {
    data.push({
      time: new Date(now - i * 3000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      speed: Math.floor(Math.random() * 160 + 20),
      health: Math.floor(Math.random() * 15 + 80),
      temperature: +(Math.random() * 10 + 28).toFixed(1),
    });
  }
  return data;
};

// Safety statistics
export const safetyStats = [
  { label: 'Accidents Prevented', value: 15420, suffix: '+', icon: 'shield' },
  { label: 'Active Crossings', value: 2847, suffix: '', icon: 'train' },
  { label: 'System Uptime', value: 99.7, suffix: '%', icon: 'clock' },
  { label: 'Response Time', value: 0.3, suffix: 's', icon: 'zap' },
];

// Features list
export const features = [
  { title: 'Automatic Train Detection', description: 'IR sensors detect approaching trains up to 500m away with sub-second response time.', icon: 'radar', color: 'green' },
  { title: 'Smart Gate Control', description: 'Servo-driven gates automatically close and lock when a train is detected, ensuring pedestrian safety.', icon: 'gate', color: 'blue' },
  { title: 'Real-Time Monitoring', description: 'Live dashboard with sensor data, alerts, and system health monitoring available 24/7.', icon: 'monitor', color: 'purple' },
  { title: 'Alert System', description: 'Multi-level warning with buzzer alarms, LED signals, and push notifications for operators.', icon: 'bell', color: 'red' },
  { title: 'IoT Integration', description: 'ESP32/Arduino-powered with WiFi connectivity for remote monitoring and cloud data logging.', icon: 'wifi', color: 'yellow' },
  { title: 'Emergency Override', description: 'Manual emergency controls allow operators to override automated systems when needed.', icon: 'emergency', color: 'orange' },
];

// Technology stack
export const techStack = [
  { name: 'Arduino UNO', category: 'Microcontroller' },
  { name: 'ESP32', category: 'IoT Module' },
  { name: 'IR Sensor', category: 'Detection' },
  { name: 'Servo Motor SG90', category: 'Actuator' },
  { name: 'Buzzer Module', category: 'Alert' },
  { name: 'LED Signal Lights', category: 'Visual Alert' },
  { name: 'React.js', category: 'Frontend' },
  { name: 'Firebase', category: 'Database' },
  { name: 'MQTT Protocol', category: 'Communication' },
];

// Components used in the project
export const componentsUsed = [
  { name: 'Arduino UNO R3', specs: 'ATmega328P, 16MHz, 14 Digital I/O', purpose: 'Main microcontroller for sensor processing' },
  { name: 'ESP32 DevKit', specs: 'Dual-core, WiFi + BLE, 240MHz', purpose: 'IoT connectivity and cloud communication' },
  { name: 'IR Sensor Module', specs: 'Detection range: 2-30cm', purpose: 'Train detection at close range' },
  { name: 'SG90 Servo Motor', specs: '180° rotation, 4.8-6V, 1.8kg·cm', purpose: 'Gate barrier control mechanism' },
  { name: 'Active Buzzer', specs: '5V, 85dB, 2300Hz', purpose: 'Audio warning for pedestrians' },
  { name: 'LED Signal Array', specs: 'Red/Yellow/Green, 5mm, 20mA', purpose: 'Visual traffic signal indication' },
  { name: 'LCD Display 16×2', specs: 'I2C Interface, HD44780', purpose: 'Local status display at crossing' },
];

// Team members
export const teamMembers = [
  { name: 'Team Member 1', role: 'Project Lead & Hardware Design', avatar: '👨‍💻' },
  { name: 'Team Member 2', role: 'Software Development & IoT', avatar: '👩‍💻' },
  { name: 'Team Member 3', role: 'Circuit Design & Testing', avatar: '👨‍🔬' },
  { name: 'Team Member 4', role: 'Documentation & Research', avatar: '👩‍🔬' },
];

// Mock preset users (admin & railway come pre-loaded)
export const mockUsers = [
  { email: 'admin@safecross.io', password: 'admin123', role: ROLES.ADMIN, name: 'System Administrator' },
  { email: 'railway@safecross.io', password: 'railway123', role: ROLES.RAILWAY, name: 'Railway Authority Officer' },
];
