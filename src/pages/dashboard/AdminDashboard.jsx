import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Car, DollarSign, TrendingUp, TrendingDown, ArrowUpRight,
  CheckCircle2, Star, ChevronRight, Receipt, CalendarCheck,
} from 'lucide-react';
import { useCars } from '../../hooks/useCars';
import { useBookings } from '../../hooks/useBookings';
import { useUsers } from '../../hooks/useUsers';
import { useReviews } from '../../hooks/useReviews';
import { fadeUp, StatCard, statusMeta } from '../../components/dashboard/shared';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100';

// Last-6-months revenue buckets from real bookings.
function monthlyRevenue(bookings) {
  const now = new Date();
  const buckets = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString('en-US', { month: 'short' }), value: 0 });
  }
  const map = Object.fromEntries(buckets.map((b) => [b.key, b]));
  bookings.forEach((b) => {
    const d = new Date(b.createdAt || b.pickupDate);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (map[key]) map[key].value += b.total;
  });
  return buckets;
}

const quickActions = [
  { to: '/dashboard/admin/users', label: 'Manage Users', icon: Users, color: 'purple' },
  { to: '/dashboard/admin/cars', label: 'Manage Fleet', icon: Car, color: 'blue' },
  { to: '/dashboard/admin/bookings', label: 'All Bookings', icon: CalendarCheck, color: 'brand' },
];
const actionColor = {
  brand: 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400',
  blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
};

export default function AdminDashboard() {
  const carsQ = useCars({});
  const bookingsQ = useBookings({});
  const usersQ = useUsers();
  const reviewsQ = useReviews();

  const isLoading = carsQ.isLoading || bookingsQ.isLoading || usersQ.isLoading;
  const isError = carsQ.isError || bookingsQ.isError || usersQ.isError;

  const allCars = carsQ.data || [];
  const allBookings = bookingsQ.data || [];
  const users = usersQ.data || [];
  const reviews = reviewsQ.data || [];

  // Revenue excludes cancelled bookings.
  const paid = allBookings.filter((b) => b.status !== 'cancelled');
  const totalRevenue = paid.reduce((s, b) => s + b.total, 0);
  const avgValue = paid.length ? Math.round(totalRevenue / paid.length) : 0;
  const activeCount = allBookings.filter((b) => b.status === 'active').length;
  const availCars = allCars.filter((c) => c.available).length;

  const rev = monthlyRevenue(paid);
  const maxRev = Math.max(1, ...rev.map((m) => m.value));
  const thisM = rev[rev.length - 1].value;
  const lastM = rev[rev.length - 2]?.value || 0;
  const pct = lastM ? Math.round(((thisM - lastM) / lastM) * 100) : thisM ? 100 : 0;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `avg $${avgValue.toLocaleString()}/booking`, icon: DollarSign, color: 'emerald', cornerIcon: ArrowUpRight },
    { label: 'Total Bookings', value: allBookings.length, sub: `${activeCount} active now`, icon: CheckCircle2, color: 'brand', cornerIcon: ArrowUpRight },
    { label: 'Fleet Size', value: allCars.length, sub: `${availCars} available`, icon: Car, color: 'blue', cornerIcon: ArrowUpRight },
    { label: 'Registered Users', value: users.length, sub: `${users.filter((u) => u.role === 'agency').length} agencies`, icon: Users, color: 'purple', cornerIcon: ArrowUpRight },
  ];

  // Bookings grouped by status.
  const statusList = ['upcoming', 'active', 'completed', 'cancelled'];
  const statusCounts = statusList.map((s) => ({ s, count: allBookings.filter((b) => b.status === s).length }));
  const maxStatus = Math.max(1, ...statusCounts.map((x) => x.count));
  const statusBar = {
    upcoming: 'bg-amber-500', active: 'bg-brand-500', completed: 'bg-emerald-500', cancelled: 'bg-red-500',
  };

  // Top customers by spend (non-cancelled).
  const byCustomer = {};
  paid.forEach((b) => {
    byCustomer[b.userEmail] = byCustomer[b.userEmail] || { email: b.userEmail, name: b.userName, bookings: 0, spent: 0 };
    byCustomer[b.userEmail].bookings += 1;
    byCustomer[b.userEmail].spent += b.total;
  });
  const topCustomers = Object.values(byCustomer).sort((a, b) => b.spent - a.spent).slice(0, 5);

  const recentReviews = reviews.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Admin Panel</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Platform Overview</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-[#1e2d47] text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-700 hover:-translate-y-0.5 transition-all">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${actionColor[color]}`}><Icon size={13} /></span>
              {label}
            </Link>
          ))}
        </div>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading platform data…" />
      ) : isError ? (
        <ErrorState message="We couldn’t load the admin data." onRetry={() => { carsQ.refetch(); bookingsQ.refetch(); usersQ.refetch(); }} />
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
          </div>

          {/* Revenue chart + Bookings by status */}
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div {...fadeUp(5)} className="card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Revenue</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Last 6 months · this month ${thisM.toLocaleString()}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-bold ${pct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {pct >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />} {pct >= 0 ? '+' : ''}{pct}%
                </div>
              </div>
              <div className="flex items-end gap-3 h-40">
                {rev.map(({ month, value }, i) => {
                  const h = (value / maxRev) * 100;
                  const isLast = i === rev.length - 1;
                  return (
                    <div key={month + i} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">${(value / 1000).toFixed(value >= 1000 ? 0 : 1)}k</span>
                      <motion.div
                        className={`w-full rounded-xl ${isLast ? 'brand-gradient' : 'bg-slate-200 dark:bg-[#1a2640]'}`}
                        style={{ minHeight: 4 }}
                        initial={{ height: 0 }} animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                      />
                      <span className="text-xs text-slate-400">{month}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div {...fadeUp(6)} className="card p-6">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Bookings by Status</h2>
              <div className="space-y-3.5">
                {statusCounts.map(({ s, count }) => (
                  <div key={s}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{s}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-[#1a2640] rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${statusBar[s]}`} initial={{ width: 0 }} animate={{ width: `${(count / maxStatus) * 100}%` }} transition={{ duration: 0.7, delay: 0.3 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
                <span className="text-sm text-slate-500 dark:text-slate-400">Avg. booking value</span>
                <span className="font-black text-brand-600 dark:text-brand-400">${avgValue.toLocaleString()}</span>
              </div>
            </motion.div>
          </div>

          {/* Top customers + Recent reviews */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(7)} className="card overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Top Customers</h2>
                <Link to="/dashboard/admin/users" className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">All users <ChevronRight size={13} /></Link>
              </div>
              <div className="p-4 sm:p-6 space-y-2">
                {topCustomers.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No customer activity yet.</p>}
                {topCustomers.map((c, i) => (
                  <div key={c.email} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0d1930] transition-colors">
                    <span className="w-6 text-center text-xs font-black text-slate-400">#{i + 1}</span>
                    <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {c.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{c.name}</p>
                      <p className="text-xs text-slate-400 truncate">{c.bookings} booking{c.bookings !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="font-black text-brand-600 dark:text-brand-400 text-sm">${c.spent.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(8)} className="card overflow-hidden">
              <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47]">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Reviews</h2>
              </div>
              <div className="p-4 sm:p-6 space-y-3">
                {recentReviews.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No reviews yet.</p>}
                {recentReviews.map((r) => (
                  <Link key={r._id || r.id} to={`/cars/${r.carId}`} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0d1930] transition-colors">
                    <img src={r.avatar} alt={r.name} className="w-9 h-9 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{r.name}</p>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[...Array(r.rating)].map((_, i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{r.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{r.body}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent bookings table */}
          <motion.div {...fadeUp(9)} className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Receipt size={18} className="text-brand-500" /> Recent Bookings
              </h2>
              <Link to="/dashboard/admin/bookings" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#1e2d47]">
                    {['Booking ID', 'Customer', 'Vehicle', 'Dates', 'Total', 'Status'].map((h) => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allBookings.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">No bookings yet.</td></tr>
                  )}
                  {allBookings.slice(0, 8).map((b) => {
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
          </motion.div>
        </>
      )}
    </div>
  );
}
