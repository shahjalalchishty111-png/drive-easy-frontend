import { motion } from 'framer-motion';
import { Search, Calendar, Car } from 'lucide-react';

const howItWorks = [
  { icon: Search, title: 'Search', desc: 'Filter by category, location, and dates to find your perfect vehicle.' },
  { icon: Calendar, title: 'Book', desc: 'Confirm your booking instantly with our secure, seamless checkout.' },
  { icon: Car, title: 'Drive', desc: 'Receive white-glove delivery — just take the keys and go.' },
];

export default function HowItWorks() {
  return (
    <section className="bg-slate-100 dark:bg-[#0d1930] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Simple Process</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            The Seamless Journey
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Your premium rental experience is engineered to be as smooth as the drive itself.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-brand-300 dark:via-brand-800 to-transparent" />

          {howItWorks.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative z-10 text-center group"
            >
              <div className={`w-24 h-24 mx-auto mb-6 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300 ${
                i === 2 ? 'brand-gradient shadow-brand-600/25' : 'bg-white dark:bg-[#131b2e] shadow-black/5'
              }`}>
                <Icon size={32} className={i === 2 ? 'text-white' : 'text-brand-600 dark:text-brand-400'} />
              </div>
              <div className="w-8 h-8 mx-auto mb-4 rounded-full bg-brand-600 text-white text-sm font-black flex items-center justify-center">
                {i + 1}
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
