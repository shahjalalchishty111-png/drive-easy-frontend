import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' } }),
};

const stats = [
  { value: '2,400+', label: 'Premium Vehicles' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '180+', label: 'Cities Covered' },
  { value: '24/7', label: 'Concierge Support' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* BG blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[700px] h-[700px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[120px] translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[100px] -translate-x-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 mb-8">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-brand-700 dark:text-brand-300 tracking-wider uppercase">Premium Fleet Available Now</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
              className="font-display text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-6">
              Experience <br />
              <span className="text-brand-600 dark:text-brand-400 italic">Luxury</span><br />
              Mobility
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
              className="text-lg text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-10">
              Curated fleet of premium vehicles for the discerning traveler. Seamless booking, door-to-door delivery, and 24/7 concierge support.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
              className="flex flex-wrap gap-4 mb-14">
              <Link to="/cars" className="btn-primary px-8 py-4 text-base">
                Browse Fleet <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-ghost px-8 py-4 text-base">
                Learn More
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
              className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-black text-slate-900 dark:text-white">{value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="absolute inset-0 bg-brand-500/10 dark:bg-brand-500/20 rounded-[3rem] blur-3xl scale-90" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-900/20 dark:shadow-brand-900/50 ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop"
                alt="Luxury car"
                className="w-full h-[520px] object-cover"
              />
              {/* Floating card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-[#131b2e]/90 glass rounded-2xl p-4 flex items-center justify-between shadow-xl"
              >
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Featured Today</p>
                  <p className="font-display font-bold text-slate-900 dark:text-white">Lumina Spectre X</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-xs text-slate-500 ml-1">4.9 (128)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-brand-600 dark:text-brand-400">$450</p>
                  <p className="text-xs text-slate-400">/day</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
