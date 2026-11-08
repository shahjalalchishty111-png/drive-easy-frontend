import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CalendarCheck, Star, DollarSign, ArrowRight, ChevronRight, Car, CheckCircle2,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { useBookings } from '../../hooks/useBookings';
import { fadeUp, StatCard, BookingItem } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

export default function UserDashboard() {
  const { user } = useAuth();
  const { dbUser } = useUserRole();
  const { data: bookings = [], isLoading, isError, refetch } = useBookings({ user: user?.email });

  const name = dbUser?.name || user?.displayName || 'there';
  const totalSpent = bookings.reduce((s, b) => s + b.total, 0);
  const activeCount = bookings.filter(b => b.status === 'active').length;
  const doneCount = bookings.filter(b => b.status === 'completed').length;

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck, color: 'brand' },
    { label: 'Total Spent', value: `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: 'emerald' },
    { label: 'Active Rentals', value: activeCount, icon: Car, color: 'blue' },
    { label: 'Completed', value: doneCount, icon: CheckCircle2, color: 'purple' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div {...fadeUp(0)}>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Welcome back 👋</p>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">{name}</h1>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading your dashboard…" />
      ) : isError ? (
        <ErrorState message="We couldn’t load your bookings." onRetry={refetch} />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
          </div>

          {/* Recent Bookings */}
          <motion.div {...fadeUp(5)} className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Bookings</h2>
              <Link to="/dashboard/user/bookings" className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
                View all <ChevronRight size={13} />
              </Link>
            </div>

            <div className="p-6 space-y-4">
              {bookings.length === 0 ? (
                <EmptyState
                  icon={CalendarCheck}
                  title="No bookings yet"
                  message="Your rentals will appear here once you book a car."
                  action={<Link to="/cars" className="btn-primary text-sm px-6 py-2.5">Browse Fleet</Link>}
                />
              ) : (
                bookings.slice(0, 4).map((b, i) => (
                  <BookingItem
                    key={b.id}
                    booking={b}
                    index={i}
                    action={b.status === 'completed' && (
                      <Link to="/dashboard/user/reviews" className="mt-2 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline">
                        <Star size={11} /> Leave Review
                      </Link>
                    )}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Promo */}
          <motion.div {...fadeUp(6)}>
            <div className="brand-gradient rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Exclusive Member Offer</p>
                <h3 className="font-display text-xl font-black text-white">Get 15% off your next booking</h3>
                <p className="text-blue-200 text-sm mt-1">Use code <span className="font-mono font-bold bg-white/10 px-2 py-0.5 rounded">VIPRIDE15</span></p>
              </div>
              <Link to="/cars" className="shrink-0 px-6 py-3 bg-white text-brand-700 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg shadow-black/20">
                Browse Fleet <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
