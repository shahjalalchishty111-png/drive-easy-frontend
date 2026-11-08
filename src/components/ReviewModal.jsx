import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';
import toast from '../lib/toast';
import useAuth from '../hooks/useAuth';
import { useCreateReview, useUpdateReview } from '../hooks/useReviews';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

// Modal to write a new review for `car`, or edit `existing` review.
export default function ReviewModal({ car, existing = null, onClose }) {
  const { user } = useAuth();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const isEdit = !!existing;

  const [rating, setRating] = useState(existing?.rating || 5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState(existing?.title || '');
  const [body, setBody] = useState(existing?.body || '');

  const busy = createReview.isPending || updateReview.isPending;

  const submit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      return toast.warning('Add a title and review');
    }
    try {
      if (isEdit) {
        await updateReview.mutateAsync({ id: existing._id, rating, title: title.trim(), body: body.trim() });
        toast.success('Review updated');
      } else {
        await createReview.mutateAsync({
          carId: car.id,
          userEmail: user.email,
          name: user.displayName || user.email,
          avatar: user.photoURL || undefined,
          rating,
          title: title.trim(),
          body: body.trim(),
        });
        toast.success('Thanks for your review!');
      }
      onClose();
    } catch (err) {
      toast.error('Could not save review', err.response?.data?.message || err.message);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="w-full max-w-md card p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" aria-label="Close">
            <X size={18} />
          </button>

          {/* Car header */}
          <div className="flex items-center gap-3 mb-5">
            <img src={car?.images?.[0] || FALLBACK_IMG} alt={car?.name} className="w-14 h-11 rounded-lg object-cover shrink-0" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
            <div className="min-w-0">
              <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">{car?.category}</p>
              <h3 className="font-display font-bold text-slate-900 dark:text-white truncate">{car?.name}</h3>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Your rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n} type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
                    className="p-0.5" aria-label={`${n} star${n > 1 ? 's' : ''}`}
                  >
                    <Star size={26} className={(hover || rating) >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
                  </button>
                ))}
              </div>
            </div>

            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience" maxLength={80}
              className="input-base px-4"
            />
            <textarea
              value={body} onChange={(e) => setBody(e.target.value)}
              placeholder="Tell others what the drive was like…" rows={4} maxLength={600}
              className="input-base px-4 resize-none"
            />

            <button type="submit" disabled={busy} className="btn-primary justify-center w-full py-3 disabled:opacity-60">
              {busy ? 'Saving…' : <>{isEdit ? 'Update Review' : 'Submit Review'} <Send size={15} /></>}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
