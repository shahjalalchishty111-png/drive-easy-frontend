import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Trash2, Search, MessageSquare, Info } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import { useReviews, useDeleteReview } from '../../hooks/useReviews';
import { useCars } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

export default function AdminReviews() {
  const reviewsQ = useReviews();
  const carsQ = useCars({});
  const deleteReview = useDeleteReview();
  const [q, setQ] = useState('');

  const reviews = reviewsQ.data || [];
  const cars = carsQ.data || [];
  const carMap = Object.fromEntries(cars.map((c) => [c.id, c]));

  const query = q.trim().toLowerCase();
  const filtered = !query
    ? reviews
    : reviews.filter((r) => {
        const car = carMap[r.carId];
        return [r.name, r.title, r.body, car?.name].filter(Boolean).some((s) => s.toLowerCase().includes(query));
      });

  const remove = async (review) => {
    const ok = await confirmDialog({
      title: 'Remove this review?',
      text: `“${review.title}” by ${review.name} will be permanently deleted.`,
      confirmText: 'Remove',
    });
    if (!ok) return;
    try {
      await deleteReview.mutateAsync(review._id);
      toast.success('Review removed', review.title);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All {reviews.length} customer reviews across the platform.</p>
      </motion.div>

      {reviewsQ.isLoading || carsQ.isLoading ? (
        <Spinner label="Loading reviews…" />
      ) : reviewsQ.isError ? (
        <ErrorState onRetry={() => reviewsQ.refetch()} />
      ) : (
        <>
          <motion.div {...fadeUp(1)} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1930] rounded-xl p-3">
            <Info size={14} className="text-brand-500 shrink-0 mt-0.5" />
            As admin you can read every review and remove inappropriate ones for moderation.
          </motion.div>

          <motion.div {...fadeUp(2)} className="relative max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by car, reviewer or text…" className="input-base pl-11" />
          </motion.div>

          {filtered.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No reviews" message={query ? 'No reviews match your search.' : 'No reviews have been posted yet.'} />
          ) : (
            <div className="space-y-3">
              {filtered.map((r, i) => {
                const car = carMap[r.carId];
                return (
                  <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="card p-5 flex items-start gap-4">
                    <img src={car?.images?.[0] || FALLBACK_IMG} alt={car?.name} className="w-16 h-12 rounded-lg object-cover shrink-0" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 truncate">{car?.name || r.carId}</p>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[...Array(r.rating)].map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                        </div>
                      </div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{r.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{r.body}</p>
                      <p className="text-xs text-slate-400 mt-2">by {r.name}{r.userEmail ? ` (${r.userEmail})` : ''}{r.date ? ` · ${new Date(r.date).toLocaleDateString()}` : ''}</p>
                    </div>
                    <button onClick={() => remove(r)} className="text-slate-400 hover:text-red-500 transition-colors shrink-0" aria-label="Remove review" title="Remove review">
                      <Trash2 size={16} />
                    </button>
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
