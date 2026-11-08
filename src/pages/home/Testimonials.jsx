import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Static marketing testimonials (brand copy, not user-generated data).
const homepageReviews = [
  {
    id: 'h1',
    name: 'Alexander Voss',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'CEO, Meridian Capital',
    rating: 5,
    body: 'DriveEasy has completely changed how I approach business travel. The fleet is unparalleled and the service matches the vehicles perfectly.',
  },
  {
    id: 'h2',
    name: 'Natalie Kim',
    avatar: 'https://i.pravatar.cc/150?img=25',
    role: 'Creative Director',
    rating: 5,
    body: 'I rented the Aero GT Spider for a weekend shoot and it was flawless. The team delivered it to my hotel personally. Will absolutely rent again.',
  },
  {
    id: 'h3',
    name: 'Rafael Santos',
    avatar: 'https://i.pravatar.cc/150?img=61',
    role: 'Travel Influencer',
    rating: 5,
    body: 'My audience went wild when I posted the Lumina Spectre X. Three bookings directly through my link that same week. DriveEasy is the real deal.',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-900 dark:bg-[#060e20] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-widest uppercase text-brand-400 mb-3">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Don't take our word for it — hear from our clients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {homepageReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">"{review.body}"</p>
              <div className="flex items-center gap-3">
                <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <p className="font-semibold text-white text-sm">{review.name}</p>
                  <p className="text-slate-500 text-xs">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
