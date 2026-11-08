import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="brand-gradient rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Ready for the Drive?
          </h2>
          <p className="text-blue-100 max-w-lg mx-auto mb-8 text-lg">
            Join thousands of satisfied customers who chose luxury without compromise.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/cars" className="px-8 py-4 bg-white text-brand-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg shadow-black/20 flex items-center gap-2">
              Browse Fleet <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2">
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
