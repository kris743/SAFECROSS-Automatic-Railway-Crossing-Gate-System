import { motion } from 'framer-motion';

const GaugeChart = ({ value, max = 100, label, unit = '', color = '#39ff14', size = 140 }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min(value / max, 1);
  const strokeDashoffset = circumference * (1 - percentage * 0.75); // 270 deg arc

  const getColor = () => {
    if (percentage > 0.8) return '#ff073a';
    if (percentage > 0.6) return '#ffd300';
    return color;
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-135">
        {/* Background arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor()} strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
          className="gauge-ring"
          style={{ filter: `drop-shadow(0 0 6px ${getColor()})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: size * 0.3 }}>
        <span className="text-2xl font-bold text-white" style={{ textShadow: `0 0 10px ${getColor()}40` }}>
          {typeof value === 'number' ? Math.round(value) : value}
        </span>
        <span className="text-xs text-gray-400">{unit}</span>
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">{label}</p>
    </div>
  );
};

export default GaugeChart;
