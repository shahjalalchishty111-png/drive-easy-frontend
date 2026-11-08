import { motion } from 'framer-motion';
import { Shield, Clock, Headphones, Zap } from 'lucide-react';

const perks = [
  { icon: Shield, title: 'Fully Insured', desc: 'Every vehicle comes with comprehensive coverage included.' },
  { icon: Clock, title: 'Instant Booking', desc: 'Skip the queues. Confirmed in under 60 seconds.' },
  { icon: Headphones, title: '24/7 Concierge', desc: 'A dedicated specialist is always just a call away.' },
  { icon: Zap, title: 'Free Delivery', desc: 'We bring the car to your door, anywhere in the city.' },
];

export default function Perks() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <p className="section-label mb-3">Why DriveEasy</p>
        <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
          The DriveEasy Difference
        </h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="card p-6 hover:shadow-lg hover:shadow-brand-600/8 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Icon size={22} className="text-brand-600 dark:text-brand-400" />
            </div>
            <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
