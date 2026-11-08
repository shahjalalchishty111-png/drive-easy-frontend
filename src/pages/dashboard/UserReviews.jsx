import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Pencil, Trash2, MessageSquarePlus, CalendarCheck } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import useAuth from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { useCars } from '../../hooks/useCars';
import { useReviews, useDeleteReview } from '../../hooks/useReviews';
import { fadeUp } from '../../components/dashboard/shared';
import ReviewModal from '../../components/ReviewModal';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

export default function UserReviews() {
  const { user } = useAuth();
  const bookingsQ = useBookings({ user: user?.email });
  const reviewsQ = useReviews({ user: user?.email });
  const carsQ = useCars({});
  const deleteReview = useDeleteReview();

  const [modal, setModal] = useState(null); // { car, existing }

  const isLoading = bookingsQ.isLoading || reviewsQ.isLoading || carsQ.isLoading;
  const isError = bookingsQ.isError || reviewsQ.isError || carsQ.isError;

  const bookings = bookingsQ.data || [];
  const myReviews = reviewsQ.data || [];
  const cars = carsQ.data || [];
  const carMap = Object.fromEntries(cars.map((c) => [c.id, c]));

  const reviewedCarIds = new Set(myReviews.map((r) => r.carId));
  // Unique cars the user has booked (any status) and not yet reviewed.
  const toReview = [];
  const seen = new Set();
  bookings.forEach((b) => {
    if (seen.has(b.carId) || reviewedCarIds.has(b.carId)) return;
    seen.add(b.carId);
    const car = carMap[b.carId] || { id: b.carId, name: b.carName, images: [b.carImage], category: '' };
    toReview.push(car);
  });

  const remove = async (review) => {
    const ok = await confirmDialog({
      title: 'Delete this review?',
      text: `“${review.title}” will be permanently removed.`,
      confirmText: 'Delete',
    });
    if (!ok) return;
    try {
      await deleteReview.mutateAsync(review._id);
      toast.success('Review deleted');
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">My Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review the cars you've booked, and manage your reviews.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading your reviews…" />
      ) : isError ? (
        <ErrorState onRetry={() => { bookingsQ.refetch(); reviewsQ.refetch(); }} />
      ) : (
        <>
          {/* Cars awaiting a review */}
          {toReview.length > 0 && (
            <motion.div {...fadeUp(1)} className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Write a review</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {toReview.map((car) => (
                  <div key={car.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#0d1930]">
                    <img src={car.images?.[0] || FALLBACK_IMG} alt={car.name} className="w-14 h-11 rounded-lg object-cover shrink-0" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{car.name}</p>
                      <p className="text-xs text-slate-400 truncate">{car.category}</p>
                    </div>
                    <button onClick={() => setModal({ car, existing: null })} className="btn-primary text-xs px-3 py-2 shrink-0">
                      <MessageSquarePlus size={14} /> Review
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Existing reviews */}
          <motion.div {...fadeUp(2)} className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47]">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Your reviews {myReviews.length > 0 && <span className="text-slate-400 font-normal">({myReviews.length})</span>}</h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {myReviews.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No reviews yet"
                  message={toReview.length ? 'Pick a car above to write your first review.' : 'Book a car, then share your experience here.'}
                  action={toReview.length === 0 && <Link to="/cars" className="btn-primary text-sm px-6 py-2.5">Browse Fleet</Link>}
                />
              ) : (
                myReviews.map((r, i) => {
                  const car = carMap[r.carId];
                  return (
                    <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#0d1930]">
                      <Link to={`/cars/${r.carId}`} className="shrink-0">
                        <img src={car?.images?.[0] || FALLBACK_IMG} alt={car?.name} className="w-16 h-12 rounded-lg object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{car?.name || 'Car'}</p>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {[...Array(r.rating)].map((_, j) => <Star key={j} size={12} className="text-amber-400 fill-amber-400" />)}
                          </div>
                        </div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{r.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{r.body}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button onClick={() => setModal({ car: car || { id: r.carId, name: car?.name }, existing: r })} className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:underline">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => remove(r)} className="text-xs font-bold text-red-500 flex items-center gap-1 hover:underline">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}

      {modal && <ReviewModal car={modal.car} existing={modal.existing} onClose={() => setModal(null)} />}
    </div>
  );
}
