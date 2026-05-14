import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import { safetyStats, features, techStack } from '../api/mockData';

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const featureIcons = {
  radar: '📡', gate: '🚧', monitor: '📊', bell: '🔔', wifi: '📶', emergency: '🚨',
};
const featureColors = {
  green: 'from-neon-green/20 to-neon-green/5 border-neon-green/20',
  blue: 'from-neon-blue/20 to-neon-blue/5 border-neon-blue/20',
  purple: 'from-neon-purple/20 to-neon-purple/5 border-neon-purple/20',
  red: 'from-neon-red/20 to-neon-red/5 border-neon-red/20',
  yellow: 'from-neon-yellow/20 to-neon-yellow/5 border-neon-yellow/20',
  orange: 'from-neon-orange/20 to-neon-orange/5 border-neon-orange/20',
};
const statIcons = { shield: '🛡️', train: '🚂', clock: '⏱️', zap: '⚡' };

const HomePage = () => (
  <div className="min-h-screen bg-grid">
    {/* HERO */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />

      {/* Moving train lights */}
      <div className="absolute bottom-32 left-0 right-0 overflow-hidden h-1">
        <motion.div
          className="w-40 h-1 bg-gradient-to-r from-transparent via-neon-yellow to-transparent rounded-full"
          animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="absolute bottom-36 left-0 right-0 overflow-hidden h-0.5">
        <motion.div
          className="w-32 h-0.5 bg-gradient-to-r from-transparent via-neon-red to-transparent rounded-full"
          animate={{ x: ['calc(100vw + 200px)', '-200px'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-neon-green/20 mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
          <span className="text-neon-green text-xs font-medium tracking-wider uppercase">IoT Railway Safety System</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8"
        >
          <span className="text-white">SAFE</span>
          <span className="text-neon-green text-glow-green">CROSS</span>
          <br />
          <span className="text-2xl sm:text-3xl lg:text-4xl font-medium text-gray-300 leading-normal">
            Smart Automatic Railway
            <br />Crossing Gate System
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          An intelligent IoT-based railway crossing automation system for accident prevention and smart transportation safety.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <Link to="/dashboard" className="btn-filled-green">📊 Open Dashboard</Link>
          <Link to="/dashboard" className="btn-neon btn-neon-blue">📡 Live Sensor Monitoring</Link>
          <Link to="/project" className="btn-neon btn-neon-green">📋 Project Details</Link>
        </motion.div>

        {/* Animated crossing illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="mt-20 relative"
        >
          <div className="glass-strong p-6 rounded-2xl border border-white/5 max-w-2xl mx-auto">
            <div className="relative h-32 overflow-hidden rounded-xl bg-dark-900/50">
              {/* Tracks */}
              <div className="absolute bottom-6 left-0 right-0 h-2 bg-gray-700 flex items-center justify-around">
                {Array.from({length:20}).map((_,i)=>(<div key={i} className="w-4 h-0.5 bg-gray-500"/>))}
              </div>
              <div className="absolute bottom-5 left-0 right-0 h-px bg-gray-500"/>
              <div className="absolute bottom-9 left-0 right-0 h-px bg-gray-500"/>

              {/* Gate poles and barriers */}
              <div className="absolute bottom-9 left-[30%] w-1.5 h-14 bg-gray-500 rounded-t"/>
              <motion.div
                className="absolute bottom-[72px] left-[30%] origin-left w-20 h-1.5 rounded"
                style={{background:'repeating-linear-gradient(90deg,#ff073a 0 8px,white 8px 16px)'}}
                animate={{rotate:[0,-85,0]}}
                transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}
              />
              <div className="absolute bottom-9 right-[30%] w-1.5 h-14 bg-gray-500 rounded-t"/>
              <motion.div
                className="absolute bottom-[72px] right-[30%] origin-right w-20 h-1.5 rounded"
                style={{background:'repeating-linear-gradient(90deg,white 0 8px,#ff073a 8px 16px)'}}
                animate={{rotate:[0,85,0]}}
                transition={{duration:4,repeat:Infinity,ease:'easeInOut'}}
              />

              {/* Train */}
              <motion.div
                className="absolute bottom-5 flex items-end"
                animate={{x:['-120px','calc(100% + 120px)']}}
                transition={{duration:5,repeat:Infinity,ease:'linear',delay:1.5}}
              >
                <div className="w-10 h-7 bg-gradient-to-r from-gray-500 to-gray-400 rounded-t-lg relative">
                  <motion.div className="absolute top-0.5 left-1 w-2 h-2 rounded-full bg-neon-yellow" animate={{opacity:[0.3,1,0.3]}} transition={{duration:0.3,repeat:Infinity}}/>
                </div>
                {[0,1,2].map(i=>(
                  <div key={i} className="w-8 h-5 bg-gray-500 border-l border-gray-400">
                    <div className="m-0.5 w-3 h-2 border border-gray-300/30 bg-blue-900/20 rounded-sm"/>
                  </div>
                ))}
              </motion.div>

              {/* Lights */}
              <motion.div className="absolute top-2 left-[30%] w-3 h-3 rounded-full bg-neon-red" animate={{opacity:[0.2,1,0.2],scale:[1,1.3,1]}} transition={{duration:0.8,repeat:Infinity}}/>
              <motion.div className="absolute top-2 right-[30%] w-3 h-3 rounded-full bg-neon-red" animate={{opacity:[1,0.2,1],scale:[1.3,1,1.3]}} transition={{duration:0.8,repeat:Infinity}}/>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <motion.div className="w-1.5 h-3 bg-neon-green rounded-full" animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>

    {/* ABOUT */}
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp}>
            <span className="text-neon-green text-sm font-semibold uppercase tracking-wider">About The Project</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-6">Preventing Railway Crossing Accidents with IoT</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              SAFECROSS is an intelligent IoT-based automatic railway crossing gate system designed to prevent accidents at unmanned level crossings. Using a combination of IR sensors, ultrasonic sensors, and microcontrollers, the system automatically detects approaching trains and controls crossing gates.
            </p>
            <p className="text-gray-400 leading-relaxed">
              The system features real-time monitoring, automated gate control, audio-visual warnings, and a web-based dashboard for remote supervision — making railway crossings safer for pedestrians and vehicles.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="glass-strong p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Detection Range', value: '500m', icon: '📡' },
                { label: 'Response Time', value: '<0.3s', icon: '⚡' },
                { label: 'Gate Speed', value: '2.5s', icon: '🚧' },
                { label: 'Power Mode', value: 'Solar+AC', icon: '🔋' },
              ].map((item) => (
                <div key={item.label} className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-neon-green font-bold text-lg mt-2">{item.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* STATS */}
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyStats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="glass p-8 rounded-2xl text-center hover:glow-green transition-shadow duration-300">
              <span className="text-3xl mb-3 block">{statIcons[stat.icon]}</span>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.suffix === '%' || stat.suffix === 's' ? 1 : 0} />
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-neon-blue text-sm font-semibold uppercase tracking-wider">Core Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">Intelligent Safety Features</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass p-8 rounded-2xl border bg-gradient-to-br ${featureColors[f.color]} hover:shadow-lg transition-all duration-300 cursor-default`}
            >
              <span className="text-3xl mb-5 block">{featureIcons[f.icon]}</span>
              <h3 className="text-white font-semibold text-lg mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* TECH STACK */}
    <section className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-neon-purple text-sm font-semibold uppercase tracking-wider">Technology Stack</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4">Built With Modern Technology</h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-wrap justify-center gap-5">
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={fadeUp}
              whileHover={{ scale: 1.05, y: -3 }}
              className="glass px-6 py-4 rounded-xl border border-white/5 hover:border-neon-green/20 transition-all cursor-default"
            >
              <p className="text-white text-sm font-medium">{tech.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{tech.category}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  </div>
);

export default HomePage;
