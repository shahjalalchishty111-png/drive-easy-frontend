import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Clock, Headphones, Zap, ArrowRight, Award, Globe, Heart } from 'lucide-react';

const values = [
  { icon: Award, title: 'Curated Excellence', desc: 'Every vehicle is hand-selected and maintained to concours standards.' },
  { icon: Globe, title: 'Global Reach', desc: 'Available across 180+ cities with white-glove delivery everywhere.' },
  { icon: Heart, title: 'Obsessed with Service', desc: 'A dedicated concierge for every booking, around the clock.' },
];

const perks = [
  { icon: Shield, label: 'Fully Insured' },
  { icon: Clock, label: 'Instant Booking' },
  { icon: Headphones, label: '24/7 Concierge' },
  { icon: Zap, label: 'Free Delivery' },
];

const stats = [
  { value: '2,400+', label: 'Premium Vehicles' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '180+', label: 'Cities Covered' },
  { value: '50k+', label: 'Happy Drivers' },
];

export default function About() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="bg-slate-900 dark:bg-[#060e20] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold tracking-widest uppercase text-brand-400 mb-4">
            About DriveEasy
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Redefining <span className="text-brand-400 italic">luxury</span> mobility
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            DriveEasy was founded on a simple belief: renting an extraordinary car should feel as effortless
            and refined as driving one. We bring the world's finest vehicles to your door.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-black text-brand-600 dark:text-brand-400">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-100 dark:bg-[#0d1930] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What we stand for</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-slate-900 dark:text-white">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mx-auto mb-5">
                  <Icon size={26} className="text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks + CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {perks.map(({ icon: Icon, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }} className="card p-6 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-brand-600 dark:text-brand-400" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-sm">{label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="brand-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4">Ready to experience it?</h2>
            <p className="text-blue-100 max-w-lg mx-auto mb-8 text-lg">Browse our fleet and book your extraordinary drive today.</p>
            <Link to="/cars" className="px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/20 inline-flex items-center gap-2">
              Browse Fleet <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
