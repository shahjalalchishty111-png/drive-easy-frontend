import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, Info } from 'lucide-react';
import { useBookings } from '../../hooks/useBookings';
import { fadeUp, statusMeta } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const tabs = ['all', 'upcoming', 'active', 'completed', 'cancelled'];

export default function AdminBookings() {
  const { data: bookings = [], isLoading, isError, refetch } = useBookings({});
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">All Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Every reservation across the platform — read-only oversight.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading bookings…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <motion.div {...fadeUp(1)} className="card overflow-hidden">
          {/* Note: status is managed by the agency / customer, not the admin. */}
          <div className="mx-4 sm:mx-6 mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1930] rounded-xl p-3">
            <Info size={14} className="text-brand-500 shrink-0 mt-0.5" />
            Booking status is set by the owning agency and the customer. This view is for monitoring only.
          </div>

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

          {filtered.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No bookings" message="Nothing in this category." />
          ) : (
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#1e2d47]">
                    {['Booking', 'Customer', 'Vehicle', 'Dates', 'Total', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(b => {
                    const s = statusMeta[b.status] || statusMeta.upcoming;
                    return (
                      <tr key={b.id} className="border-b border-slate-50 dark:border-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#0d1930] transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.id}</td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{b.userName}</div>
                          <div className="text-xs text-slate-400">{b.userEmail}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{b.carName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{b.pickupDate} → {b.returnDate}</td>
                        <td className="px-6 py-4 font-black text-brand-600 dark:text-brand-400">${b.total}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${s.bg} ${s.color}`}>{s.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
