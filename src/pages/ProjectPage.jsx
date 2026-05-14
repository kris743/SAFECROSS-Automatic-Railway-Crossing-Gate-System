import { motion } from 'framer-motion';
import { componentsUsed, teamMembers } from '../api/mockData';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const Section = ({ title, icon, children, id }) => (
  <motion.section id={id} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
    <div className="flex items-center gap-3 mb-6">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </motion.section>
);

const ProjectPage = () => {
  const sections = [
    { id: 'objective', label: 'Objective', icon: '🎯' },
    { id: 'problem', label: 'Problem', icon: '⚠️' },
    { id: 'working', label: 'Working', icon: '⚙️' },
    { id: 'components', label: 'Components', icon: '🔧' },
    { id: 'integration', label: 'Integration', icon: '🔌' },
    { id: 'flowchart', label: 'Flowchart', icon: '📊' },
    { id: 'advantages', label: 'Advantages', icon: '✅' },
    { id: 'future', label: 'Future', icon: '🚀' },
    { id: 'team', label: 'Team', icon: '👥' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-grid">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">Project Documentation</h1>
          <p className="text-gray-400">Complete engineering project details & specifications</p>
        </motion.div>

        {/* Quick Nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-5 rounded-xl mb-12 overflow-x-auto">
          <div className="flex gap-3 min-w-max">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-neon-green hover:bg-neon-green/5 border border-transparent hover:border-neon-green/20 transition-all whitespace-nowrap">
                {s.icon} {s.label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Objective */}
        <Section title="Project Objective" icon="🎯" id="objective">
          <div className="glass p-8 rounded-xl text-gray-300 leading-relaxed space-y-4">
            <p>The primary objective of the SAFECROSS project is to design and implement an <span className="text-neon-green font-medium">automatic railway crossing gate system</span> that eliminates the need for manual intervention at unmanned level crossings.</p>
            <p>The system uses IoT sensors and microcontrollers to detect approaching trains, automatically control crossing barriers, and provide real-time monitoring through a web dashboard.</p>
          </div>
        </Section>

        {/* Problem Statement */}
        <Section title="Problem Statement" icon="⚠️" id="problem">
          <div className="glass p-8 rounded-xl space-y-5">
            <p className="text-gray-300 leading-relaxed">India has over <span className="text-neon-red font-bold">30,000+ unmanned railway crossings</span> that are responsible for a significant number of accidents each year.</p>
            <div className="grid sm:grid-cols-3 gap-4 mt-5">
              {[
                { stat: '~16,000+', label: 'Annual Crossing Accidents', color: 'neon-red' },
                { stat: '30,000+', label: 'Unmanned Crossings', color: 'neon-yellow' },
                { stat: '~3,000+', label: 'Fatalities Per Year', color: 'neon-red' },
              ].map((item) => (
                <div key={item.label} className={`p-4 rounded-lg bg-${item.color}/5 border border-${item.color}/20 text-center`}>
                  <p className={`text-${item.color} font-bold text-xl`}>{item.stat}</p>
                  <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Working Principle */}
        <Section title="Working Principle" icon="⚙️" id="working">
          <div className="glass p-8 rounded-xl">
            <div className="space-y-5">
              {[
                { step: 1, title: 'Train Detection', desc: 'IR and ultrasonic sensors detect an approaching train at a distance of up to 500m from the crossing.', icon: '📡' },
                { step: 2, title: 'Signal Processing', desc: 'Arduino/ESP32 processes sensor data and determines the train approach speed and distance.', icon: '🖥️' },
                { step: 3, title: 'Gate Activation', desc: 'Servo motors automatically close the crossing barriers and activate warning signals.', icon: '🚧' },
                { step: 4, title: 'Alert System', desc: 'Buzzers and LED signals warn pedestrians and vehicles about the approaching train.', icon: '🔔' },
                { step: 5, title: 'Monitoring', desc: 'All data is sent to the cloud dashboard for real-time monitoring and logging.', icon: '📊' },
                { step: 6, title: 'Gate Release', desc: 'After the train passes, sensors confirm clearance and gates automatically reopen.', icon: '✅' },
              ].map((item) => (
                <motion.div key={item.step} variants={fadeUp} className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/[0.02] transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center shrink-0">
                    <span className="text-neon-green font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{item.icon} {item.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Components */}
        <Section title="Components Used" icon="🔧" id="components">
          <div className="glass rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left p-4 text-gray-400 font-medium">Component</th>
                    <th className="text-left p-4 text-gray-400 font-medium hidden sm:table-cell">Specifications</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {componentsUsed.map((c) => (
                    <tr key={c.name} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="p-4 text-neon-green font-medium">{c.name}</td>
                      <td className="p-4 text-gray-400 hidden sm:table-cell">{c.specs}</td>
                      <td className="p-4 text-gray-300">{c.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Arduino / ESP32 */}
        <Section title="Arduino / ESP32 Integration" icon="🔌" id="integration">
          <div className="glass p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-5 rounded-lg bg-white/[0.02] border border-white/5">
                <h4 className="text-neon-blue font-semibold mb-3">🔵 Arduino UNO</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• Processes sensor inputs (IR, Ultrasonic)</li>
                  <li>• Controls servo motor for gate operation</li>
                  <li>• Manages buzzer and LED signals</li>
                  <li>• Serial communication with ESP32</li>
                </ul>
              </div>
              <div className="p-5 rounded-lg bg-white/[0.02] border border-white/5">
                <h4 className="text-neon-green font-semibold mb-3">🟢 ESP32 Module</h4>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li>• WiFi-enabled IoT communication</li>
                  <li>• Sends sensor data to cloud/Firebase</li>
                  <li>• Receives remote commands from dashboard</li>
                  <li>• MQTT protocol for real-time updates</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Circuit Diagram */}
        <Section title="Circuit Diagram" icon="📐" id="circuit">
          <div className="glass p-8 rounded-xl text-center">
            <div className="w-full h-48 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl block mb-3">📐</span>
                <p className="text-gray-400 text-sm">Circuit Diagram</p>
                <p className="text-gray-600 text-xs mt-1">Replace with actual circuit schematic image</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Flowchart */}
        <Section title="System Flowchart" icon="📊" id="flowchart">
          <div className="glass p-8 rounded-xl">
            <div className="flex flex-col items-center gap-2">
              {[
                { text: 'System Power ON', color: 'neon-green' },
                { text: 'Initialize Sensors', color: 'neon-blue' },
                { text: 'Monitor for Train', color: 'neon-blue' },
                { text: 'Train Detected?', color: 'neon-yellow', diamond: true },
                { text: 'Close Gate + Alert', color: 'neon-red' },
                { text: 'Wait for Train Pass', color: 'neon-yellow' },
                { text: 'Open Gate + Clear', color: 'neon-green' },
                { text: 'Log & Send to Cloud', color: 'neon-blue' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`px-6 py-3 rounded-lg bg-${item.color}/10 border border-${item.color}/20 text-sm text-center ${item.diamond ? 'rotate-0' : ''}`}
                  >
                    <span className={`text-${item.color} font-medium`}>{item.text}</span>
                  </motion.div>
                  {i < 7 && <div className="w-px h-4 bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Advantages */}
        <Section title="Advantages" icon="✅" id="advantages">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 gap-4">
            {[
              'Fully automatic operation – no manual intervention',
              'Real-time monitoring through web dashboard',
              'Cost-effective IoT solution for rural crossings',
              'Reduces response time to under 0.3 seconds',
              'Solar power compatible for remote locations',
              'Cloud-connected for remote supervision',
              'Audio-visual multi-level warning system',
              'Emergency manual override capability',
            ].map((adv) => (
              <motion.div key={adv} variants={fadeUp} className="glass p-5 rounded-lg flex items-center gap-3">
                <span className="text-neon-green">✓</span>
                <span className="text-gray-300 text-sm">{adv}</span>
              </motion.div>
            ))}
          </motion.div>
        </Section>

        {/* Future Scope */}
        <Section title="Future Scope" icon="🚀" id="future">
          <div className="glass p-8 rounded-xl space-y-4">
            {[
              { title: 'AI-Powered Detection', desc: 'Computer vision using cameras for enhanced train detection accuracy.' },
              { title: 'GPS Integration', desc: 'Track train positions via GPS for predictive gate control.' },
              { title: 'Mobile App', desc: 'Push notifications to nearby users about approaching trains.' },
              { title: 'Solar Power', desc: 'Complete solar-powered operation for remote crossings.' },
              { title: 'Railway Network', desc: 'Integration with national railway signaling networks.' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-lg hover:bg-white/[0.02] transition-colors">
                <h4 className="text-neon-purple font-medium">{item.title}</h4>
                <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Team */}
        <Section title="Team Members" icon="👥" id="team">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {teamMembers.map((m) => (
              <motion.div key={m.name} variants={fadeUp} whileHover={{ y: -5 }} className="glass p-6 rounded-xl text-center">
                <span className="text-4xl block mb-3">{m.avatar}</span>
                <h4 className="text-white font-medium text-sm">{m.name}</h4>
                <p className="text-gray-500 text-xs mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Conclusion */}
        <Section title="Conclusion" icon="📝" id="conclusion">
          <div className="glass p-8 rounded-xl">
            <p className="text-gray-300 leading-relaxed">
              The SAFECROSS Automatic Railway Crossing Gate System successfully demonstrates how IoT technology can be applied to solve critical safety challenges in railway transportation. By combining affordable sensors, microcontrollers, and cloud connectivity, this system provides a scalable, cost-effective solution for automating unmanned railway crossings across the country.
            </p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default ProjectPage;
