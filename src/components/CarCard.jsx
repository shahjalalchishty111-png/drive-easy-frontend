import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Zap, Fuel, MapPin } from 'lucide-react';

const badgeColors = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
  gold: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
};

export default function CarCard({ car, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/cars/${car.id}`} className="group block">
        <div className="card overflow-hidden hover:shadow-xl hover:shadow-brand-600/10 hover:-translate-y-1.5 transition-all duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-[#0d1930]">
            <img
              src={car.images[0]}
              alt={car.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop'; }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Badge */}
            <div className="absolute top-3 left-3">
              <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-lg ${badgeColors[car.badgeColor] || badgeColors.blue}`}>
                {car.badge}
              </span>
            </div>

            {/* Availability */}
            {!car.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white/20 backdrop-blur text-white font-bold px-4 py-1.5 rounded-full text-sm">
                  Unavailable
                </span>
              </div>
            )}

            {/* Rating */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{car.rating}</span>
              <span className="text-white/60 text-xs">({car.reviewCount})</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-0.5">
                  {car.category}
                </p>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight">
                  {car.name}
                </h3>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400">${car.pricePerDay}</span>
                <span className="text-slate-400 text-xs block">/day</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-500 text-xs mb-4">
              <MapPin size={12} />
              <span>{car.location}</span>
            </div>

            {/* Specs */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-[#1e2d47]">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                <Users size={13} />
                <span>{car.seats}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                <Zap size={13} />
                <span>{car.acceleration}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                <Fuel size={13} />
                <span>{car.fuel}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
