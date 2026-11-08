import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from '../lib/toast';
import useAuth from '../hooks/useAuth';
import { useCreateReview } from '../hooks/useReviews';

// Compact "write a review" form. Requires a signed-in user.
export default function ReviewForm({ carId }) {
  const { user } = useAuth();
  const createReview = useCreateReview();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!user) {
    return (
      <div className="card p-6 text-center">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          <Link to="/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">Sign in</Link>{' '}
          to share your experience with this car.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      return toast.warning('Add a title and review');
    }
    try {
      await createReview.mutateAsync({
        carId,
        name: user.displayName || user.email,
        avatar: user.photoURL || undefined,
        rating,
        title: title.trim(),
        body: body.trim(),
      });
      setTitle(''); setBody(''); setRating(5);
      toast.success('Thanks for your review!');
    } catch (err) {
      toast.error('Could not submit review', err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-4">
      <h4 className="font-display font-bold text-slate-900 dark:text-white">Write a Review</h4>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5"
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
          >
            <Star size={22} className={(hover || rating) >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'} />
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
        className="input-base px-4"
        maxLength={80}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Tell others what the drive was like…"
        rows={3}
        className="input-base px-4 resize-none"
        maxLength={600}
      />

      <button type="submit" disabled={createReview.isPending} className="btn-primary justify-center w-full py-3 disabled:opacity-60">
        {createReview.isPending ? 'Submitting…' : <>Submit Review <Send size={15} /></>}
      </button>
    </form>
  );
}
