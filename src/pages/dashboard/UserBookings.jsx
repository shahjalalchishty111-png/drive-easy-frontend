import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarCheck, Star, X } from 'lucide-react';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import { useBookings, useUpdateBooking } from '../../hooks/useBookings';
import { fadeUp, BookingItem } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const tabs = ['all', 'active', 'upcoming', 'completed', 'cancelled'];

export default function UserBookings() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, isError, refetch } = useBookings({ user: user?.email });
  const updateBooking = useUpdateBooking();
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  const cancel = async (booking) => {
    try {
      await updateBooking.mutateAsync({ id: booking.id, status: 'cancelled' });
      toast.success('Booking cancelled', `${booking.carName} · ${booking.pickupDate}`);
    } catch (err) {
      toast.error('Could not cancel', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">My Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your current and past rentals.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading bookings…" />
      ) : isError ? (
        <ErrorState message="We couldn’t load your bookings." onRetry={refetch} />
      ) : (
        <motion.div {...fadeUp(1)} className="card overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-1 px-4 sm:px-6 pt-4 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide capitalize whitespace-nowrap transition-all ${
                  tab === t
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2640]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            {filtered.length === 0 ? (
              <EmptyState
                icon={CalendarCheck}
                title="No bookings here"
                message="Nothing in this category yet."
                action={<Link to="/cars" className="btn-primary text-sm px-6 py-2.5">Browse Fleet</Link>}
              />
            ) : (
              filtered.map((b, i) => (
                <BookingItem
                  key={b.id}
                  booking={b}
                  index={i}
                  action={
                    b.status === 'completed' ? (
                      <Link to="/dashboard/user/reviews" className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline">
                        <Star size={11} /> Review
                      </Link>
                    ) : (b.status === 'upcoming' || b.status === 'active') ? (
                      <button
                        onClick={() => cancel(b)}
                        disabled={updateBooking.isPending}
                        className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1 hover:underline disabled:opacity-50"
                      >
                        <X size={11} /> Cancel
                      </button>
                    ) : null
                  }
                />
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
