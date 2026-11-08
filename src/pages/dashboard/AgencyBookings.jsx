import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck } from 'lucide-react';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import { useBookings, useUpdateBooking } from '../../hooks/useBookings';
import { fadeUp, BookingItem } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const tabs = ['all', 'upcoming', 'active', 'completed', 'cancelled'];
const statusOptions = ['upcoming', 'active', 'completed', 'cancelled'];
const statusDot = {
  upcoming: 'bg-amber-500', active: 'bg-brand-500', completed: 'bg-emerald-500', cancelled: 'bg-red-500',
};

export default function AgencyBookings() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, isError, refetch } = useBookings({ owner: user?.email });
  const updateBooking = useUpdateBooking();
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  const setStatus = async (b, status) => {
    if (status === b.status) return;
    try {
      await updateBooking.mutateAsync({ id: b.id, status });
      toast.success('Booking updated', `${b.id} → ${status}`);
    } catch (err) {
      toast.error('Update failed', err.response?.data?.message || err.message);
    }
  };

  const StatusSelect = ({ booking }) => (
    <div className="inline-flex items-center gap-2 mt-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[booking.status] || 'bg-slate-400'}`} />
      <select
        value={booking.status}
        onChange={(e) => setStatus(booking, e.target.value)}
        disabled={updateBooking.isPending}
        className="text-xs font-semibold capitalize rounded-lg border border-slate-200 dark:border-[#1e2d47] bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-200 px-2.5 py-1.5 cursor-pointer outline-none focus:border-brand-500 disabled:opacity-60 transition-colors"
        aria-label="Change booking status"
      >
        {statusOptions.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Reservations for your vehicles — update their status as they progress.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading bookings…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <motion.div {...fadeUp(1)} className="card overflow-hidden">
          <div className="flex gap-1 px-4 sm:px-6 pt-4 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide capitalize whitespace-nowrap transition-all ${
                  tab === t ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2640]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {filtered.length === 0 ? (
              <EmptyState icon={CalendarCheck} title="No bookings" message="Bookings for your cars will show here." />
            ) : (
              filtered.map((b, i) => (
                <BookingItem key={b.id} booking={b} index={i} action={<StatusSelect booking={b} />} />
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
