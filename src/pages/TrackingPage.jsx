import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { crossings, trainSchedule, getTrainsForCrossing, getTrainLiveStatus } from '../api/mockData';
import { useAuth } from '../context/AuthContext';

const TrackingPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState('select'); // 'select' | 'crossing' | 'train'
  const [selectedCrossing, setSelectedCrossing] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveData, setLiveData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Auto-refresh live data every 5 seconds
  useEffect(() => {
    if (!selectedCrossing && !selectedTrain) return;

    const refresh = () => {
      if (selectedCrossing && selectedTrain) {
        setLiveData(getTrainLiveStatus(selectedTrain.trainId, selectedCrossing.id));
      }
      setLastRefresh(new Date());
    };

    refresh(); // initial
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [selectedCrossing, selectedTrain]);

  // Step 1: Select a crossing
  const handleSelectCrossing = (crossing) => {
    setSelectedCrossing(crossing);
    setSelectedTrain(null);
    setLiveData(null);
    setView('crossing');
  };

  // Step 2: Select a train from the crossing's schedule
  const handleSelectTrain = (train) => {
    setSelectedTrain(train);
    setView('train');
  };

  // Go back
  const handleBack = () => {
    if (view === 'train') {
      setSelectedTrain(null);
      setLiveData(null);
      setView('crossing');
    } else {
      setSelectedCrossing(null);
      setSelectedTrain(null);
      setLiveData(null);
      setView('select');
    }
  };

  // Trains for selected crossing
  const crossingTrains = selectedCrossing ? getTrainsForCrossing(selectedCrossing.id) : [];

  // Filtered crossings based on search
  const filteredCrossings = crossings.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered trains based on search
  const filteredTrains = trainSchedule.filter((t) =>
    t.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.trainNumber.includes(searchQuery) ||
    t.trainId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-grid">
      <div className="max-w-5xl mx-auto">

        {/* ===== STEP 1: SELECT CROSSING ===== */}
        {view === 'select' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">📍 Select Your Crossing</h1>
              <p className="text-gray-400 text-base mt-2">
                Choose the railway crossing near you to check train status
              </p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search crossing by name, location, or ID..."
                className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/40 focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all text-sm"
              />
            </div>

            {/* Also show train search */}
            {searchQuery.length > 0 && filteredTrains.length > 0 && (
              <div className="mb-8">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">🚂 Matching Trains</h3>
                <div className="space-y-2">
                  {filteredTrains.slice(0, 4).map((t) => (
                    <div key={t.trainId} className="glass p-4 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{t.trainName}</p>
                        <p className="text-gray-500 text-sm">#{t.trainNumber} • {t.from} → {t.to}</p>
                      </div>
                      <p className="text-gray-500 text-sm">{t.route.length} crossings on route</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crossings Grid */}
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">
              {searchQuery ? `${filteredCrossings.length} crossings found` : 'All Crossings'}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCrossings.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCrossing(c)}
                  className={`glass p-6 rounded-xl border cursor-pointer transition-all ${
                    c.status === 'maintenance'
                      ? 'border-neon-yellow/20 hover:border-neon-yellow/40'
                      : 'border-white/5 hover:border-neon-green/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500 font-mono">{c.id}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      c.status === 'maintenance'
                        ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20'
                        : 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                    }`}>
                      {c.status === 'maintenance' ? '🔧 Maintenance' : '✅ Active'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-base">{c.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">📍 {c.location}</p>
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      🚂 {getTrainsForCrossing(c.id).length} trains on route
                    </span>
                    <span className="text-neon-blue text-sm font-medium">View →</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredCrossings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No crossings found for "{searchQuery}"</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== STEP 2: CROSSING DETAIL — Select a Train ===== */}
        {view === 'crossing' && selectedCrossing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Back button + Header */}
            <button onClick={handleBack} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2 transition-colors">
              ← Back to Crossings
            </button>

            <div className="glass p-6 rounded-xl border border-white/10 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">{selectedCrossing.name}</h1>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      selectedCrossing.status === 'maintenance'
                        ? 'bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/20'
                        : 'bg-neon-green/10 text-neon-green border border-neon-green/20'
                    }`}>
                      {selectedCrossing.status === 'maintenance' ? '🔧 Maintenance' : '✅ Active'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">📍 {selectedCrossing.location} • ID: {selectedCrossing.id}</p>
                </div>
              </div>
            </div>

            {/* Train List */}
            <h2 className="text-white font-semibold text-xl mb-5">
              🚂 Trains passing through this crossing
              <span className="text-sm text-gray-500 font-normal ml-2">({crossingTrains.length} trains)</span>
            </h2>
            <p className="text-gray-400 text-sm mb-5">Select a train to see live tracking status at this crossing</p>

            {crossingTrains.length === 0 ? (
              <div className="text-center py-16 glass rounded-xl">
                <p className="text-gray-500 text-lg">No trains scheduled for this crossing</p>
              </div>
            ) : (
              <div className="space-y-4">
                {crossingTrains.map((train) => (
                  <motion.div
                    key={train.trainId}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectTrain(train)}
                    className="glass p-5 rounded-xl border border-white/5 hover:border-neon-blue/30 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg">{train.trainName}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 font-mono">#{train.trainNumber}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          train.type === 'Semi High-Speed' ? 'bg-neon-blue/10 text-neon-blue' :
                          train.type === 'Superfast' ? 'bg-neon-green/10 text-neon-green' :
                          'bg-white/5 text-gray-400'
                        }`}>{train.type}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{train.from} → {train.to}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-400">🕐 Dep: {train.departureTime}</span>
                        <span className="text-gray-400">🕐 Arr: {train.arrivalTime}</span>
                        <span className="text-gray-600 text-xs">{train.days.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-neon-blue text-sm font-medium">Track Live →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ===== STEP 3: LIVE TRAIN STATUS AT CROSSING ===== */}
        {view === 'train' && selectedCrossing && selectedTrain && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Back button */}
            <button onClick={handleBack} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2 transition-colors">
              ← Back to {selectedCrossing.name}
            </button>

            {/* Train + Crossing Info */}
            <div className="glass p-6 rounded-xl border border-white/10 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{selectedTrain.trainName}</h1>
                  <p className="text-gray-400 text-sm mt-1">
                    #{selectedTrain.trainNumber} • {selectedTrain.from} → {selectedTrain.to} • {selectedTrain.type}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-gray-500 text-xs uppercase">At Crossing</p>
                  <p className="text-neon-blue text-sm font-medium">{selectedCrossing.name}</p>
                </div>
              </div>
            </div>

            {/* Live Status Card */}
            <AnimatePresence mode="wait">
              {liveData && (
                <motion.div
                  key={lastRefresh.getTime()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Alert if approaching */}
                  {liveData.approaching && (
                    <div className="p-5 rounded-xl bg-neon-red/5 border border-neon-red/20 animate-blink-red flex items-center gap-4">
                      <span className="text-3xl">🚨</span>
                      <div>
                        <p className="text-neon-red font-bold text-lg">TRAIN APPROACHING THIS CROSSING</p>
                        <p className="text-neon-red/70 text-sm">Gate is closing. Do not cross the railway track!</p>
                      </div>
                    </div>
                  )}

                  {/* Status Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`glass p-5 rounded-xl text-center border ${
                      liveData.approaching ? 'border-neon-red/30' : liveData.isNear ? 'border-neon-yellow/30' : 'border-white/5'
                    }`}>
                      <p className="text-gray-500 text-xs uppercase mb-2">Status</p>
                      <p className={`text-lg font-bold ${
                        liveData.approaching ? 'text-neon-red' : liveData.isNear ? 'text-neon-yellow' : 'text-neon-green'
                      }`}>
                        {liveData.approaching ? '⚠️ AT CROSSING' : liveData.isNear ? '🟡 NEAR' : '✅ FAR'}
                      </p>
                    </div>
                    <div className="glass p-5 rounded-xl text-center">
                      <p className="text-gray-500 text-xs uppercase mb-2">Distance</p>
                      <p className={`text-2xl font-bold ${liveData.approaching ? 'text-neon-red' : 'text-white'}`}>
                        {liveData.distanceKm} <span className="text-sm font-normal text-gray-400">km</span>
                      </p>
                    </div>
                    <div className="glass p-5 rounded-xl text-center">
                      <p className="text-gray-500 text-xs uppercase mb-2">ETA</p>
                      <p className={`text-2xl font-bold ${liveData.approaching ? 'text-neon-yellow' : 'text-white'}`}>
                        {liveData.eta}
                      </p>
                    </div>
                  </div>

                  {/* More Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="glass p-5 rounded-xl">
                      <h3 className="text-white font-semibold mb-3">🚂 Train Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Train Name</span><span className="text-white">{selectedTrain.trainName}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Train Number</span><span className="text-white">#{selectedTrain.trainNumber}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Route</span><span className="text-white">{selectedTrain.from} → {selectedTrain.to}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Type</span><span className="text-neon-blue">{selectedTrain.type}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Direction</span><span className="text-white">{liveData.direction}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Running On</span><span className="text-gray-300">{selectedTrain.days.join(', ')}</span></div>
                      </div>
                    </div>
                    <div className="glass p-5 rounded-xl">
                      <h3 className="text-white font-semibold mb-3">📍 Crossing Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-gray-500">Crossing</span><span className="text-white">{selectedCrossing.name}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Location</span><span className="text-white">{selectedCrossing.location}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Crossing ID</span><span className="text-gray-300 font-mono">{selectedCrossing.id}</span></div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Gate Status</span>
                          <span className={`font-bold ${liveData.approaching ? 'text-neon-red' : 'text-neon-green'}`}>
                            {liveData.approaching ? '⛔ CLOSED' : '✅ OPEN'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Crossing Status</span>
                          <span className={`${selectedCrossing.status === 'maintenance' ? 'text-neon-yellow' : 'text-neon-green'}`}>
                            {selectedCrossing.status === 'maintenance' ? '🔧 Maintenance' : '✅ Active'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Train Route (which crossings it passes through) */}
                  <div className="glass p-5 rounded-xl">
                    <h3 className="text-white font-semibold mb-3">🗺️ Route Crossings</h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedTrain.route.map((crsId) => {
                        const crs = crossings.find((c) => c.id === crsId);
                        const isCurrent = crsId === selectedCrossing.id;
                        return (
                          <div
                            key={crsId}
                            className={`px-4 py-2.5 rounded-lg text-sm border ${
                              isCurrent
                                ? 'bg-neon-green/10 border-neon-green/30 text-neon-green font-semibold'
                                : 'bg-white/[0.02] border-white/5 text-gray-400'
                            }`}
                          >
                            {isCurrent && '📍 '}{crs?.name || crsId}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Refresh indicator */}
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                    <motion.div className="flex items-center gap-1.5" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                      <div className="w-2 h-2 rounded-full bg-neon-green" />
                      <span className="text-neon-green text-xs">Live</span>
                    </motion.div>
                    <span>Auto-refreshing • Last updated: {lastRefresh.toLocaleTimeString()}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default TrackingPage;
