import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, MapPin, Clock, CheckCircle2, AlertCircle, Circle, XCircle } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

export const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.07 },
});

export const statusMeta = {
  active:    { label: 'Active',    color: 'text-brand-600 dark:text-brand-400',     bg: 'bg-brand-50 dark:bg-brand-900/30',     icon: Circle },
  upcoming:  { label: 'Upcoming',  color: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/30',     icon: AlertCircle },
  completed: { label: 'Completed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-500 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-900/20',         icon: XCircle },
};

const colorMap = {
  brand:   'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
  emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  blue:    'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple:  'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  amber:   'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
};

export function StatCard({ label, value, sub, icon: Icon, color = 'brand', index = 0, cornerIcon: Corner }) {
  return (
    <motion.div {...fadeUp(index + 1)} className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={19} />
        </div>
        {Corner && <Corner size={16} className="text-emerald-500" />}
      </div>
      <p className="font-display text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-emerald-500 font-semibold mt-1">{sub}</p>}
    </motion.div>
  );
}

// A single booking as a horizontal card. `action` renders on the right (e.g. review/cancel button).
export function BookingItem({ booking, index = 0, action }) {
  const s = statusMeta[booking.status] || statusMeta.upcoming;
  const Icon = s.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1930] hover:bg-slate-100 dark:hover:bg-[#111e35] transition-colors"
    >
      <Link to={`/cars/${booking.carId}`} className="shrink-0">
        <img
          src={booking.carImage || FALLBACK_IMG}
          alt={booking.carName}
          className="w-full sm:w-28 h-20 object-cover rounded-xl"
          onError={e => { e.target.src = FALLBACK_IMG; }}
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{booking.carName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{booking.id}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${s.bg} ${s.color}`}>
            <Icon size={11} /> {s.label}
          </span>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><CalendarCheck size={12} /> {booking.pickupDate} → {booking.returnDate}</span>
          {booking.location && <span className="flex items-center gap-1"><MapPin size={12} /> {booking.location}</span>}
          <span className="flex items-center gap-1"><Clock size={12} /> {booking.days} days</span>
        </div>
      </div>
      <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
        <div>
          <p className="font-display text-xl font-black text-brand-600 dark:text-brand-400">${booking.total}</p>
          <p className="text-xs text-slate-400">total</p>
        </div>
        {action}
      </div>
    </motion.div>
  );
}
