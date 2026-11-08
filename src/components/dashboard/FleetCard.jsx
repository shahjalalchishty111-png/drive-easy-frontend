import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MoreHorizontal, Eye, Trash2, Pencil, CheckCircle2, XCircle } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400';

export default function FleetCard({ car, index = 0, onDelete, deleting, editTo, onToggleStatus, updating }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="relative group rounded-2xl bg-slate-50 dark:bg-[#0d1930] overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={car.images?.[0]} alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = FALLBACK_IMG; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg ${
            car.available
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
              : 'bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-300'
          }`}>
            {car.available ? 'Available' : 'Rented'}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div className="min-w-0">
            <p className="text-[10px] text-white/70">{car.category}</p>
            <p className="text-white font-bold text-sm leading-tight truncate">{car.name}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-lg flex items-center justify-center text-white"
              aria-label="Car actions"
            >
              <MoreHorizontal size={14} />
            </button>
            {menuOpen && (
              <>
                {/* click-away layer */}
                <div className="fixed inset-0 z-10" onClick={close} />
                <div className="absolute bottom-full right-0 mb-2 w-40 card shadow-lg overflow-hidden z-20">
                  <Link to={`/cars/${car.id}`} onClick={close} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640]">
                    <Eye size={13} /> View Listing
                  </Link>

                  {editTo && (
                    <Link to={editTo} onClick={close} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640]">
                      <Pencil size={13} /> Edit Details
                    </Link>
                  )}

                  {onToggleStatus && (
                    <button
                      onClick={() => { close(); onToggleStatus(car); }}
                      disabled={updating}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a2640] disabled:opacity-50"
                    >
                      {car.available ? <><XCircle size={13} /> Mark Rented</> : <><CheckCircle2 size={13} /> Mark Available</>}
                    </button>
                  )}

                  {onDelete && (
                    <button
                      onClick={() => { close(); onDelete(car); }}
                      disabled={deleting}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50"
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{car.rating}</span>
          <span className="text-xs text-slate-400">({car.reviewCount})</span>
        </div>
        <span className="font-black text-brand-600 dark:text-brand-400 text-sm">${car.pricePerDay}<span className="text-xs font-normal text-slate-400">/day</span></span>
      </div>
    </motion.div>
  );
}
