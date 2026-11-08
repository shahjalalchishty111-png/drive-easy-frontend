import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ChevronDown } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useReviews } from '../../hooks/useReviews';
import { useCars } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

export default function AgencyReviews() {
  const { user } = useAuth();
  const reviewsQ = useReviews({ owner: user?.email });
  const carsQ = useCars({ owner: user?.email });
  const [carId, setCarId] = useState('all');

  const isLoading = reviewsQ.isLoading || carsQ.isLoading;
  const isError = reviewsQ.isError || carsQ.isError;

  const reviews = reviewsQ.data || [];
  const cars = carsQ.data || [];
  const carMap = Object.fromEntries(cars.map((c) => [c.id, c]));

  const filtered = carId === 'all' ? reviews : reviews.filter((r) => r.carId === carId);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">What customers say about your fleet.</p>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20">
            <Star size={16} className="text-amber-400 fill-amber-400" />
            <span className="font-black text-slate-900 dark:text-white">{avg}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading reviews…" />
      ) : isError ? (
        <ErrorState onRetry={() => { reviewsQ.refetch(); carsQ.refetch(); }} />
      ) : (
        <>
          {/* Filter by car */}
          <motion.div {...fadeUp(1)} className="relative inline-block">
            <select
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              className="text-sm font-semibold rounded-xl border border-slate-200 dark:border-[#1e2d47] bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-200 pl-4 pr-10 py-2.5 cursor-pointer outline-none focus:border-brand-500 appearance-none"
            >
              <option value="all">All cars ({reviews.length})</option>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({reviews.filter((r) => r.carId === c.id).length})
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </motion.div>

          {filtered.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No reviews yet" message="Reviews for your cars will appear here once customers rate them." />
          ) : (
            <div className="space-y-3">
              {filtered.map((r, i) => {
                const car = carMap[r.carId];
                return (
                  <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="card p-5">
                    <div className="flex items-start gap-4">
                      <img src={car?.images?.[0] || FALLBACK_IMG} alt={car?.name} className="w-16 h-12 rounded-lg object-cover shrink-0" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 truncate">{car?.name || 'Car'}</p>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {[...Array(r.rating)].map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                          </div>
                        </div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{r.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{r.body}</p>
                        <p className="text-xs text-slate-400 mt-2">by {r.name}{r.date ? ` · ${new Date(r.date).toLocaleDateString()}` : ''}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
