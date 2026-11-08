import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, DollarSign, CalendarCheck, Star, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import { useCars, useDeleteCar, useUpdateCar } from '../../hooks/useCars';
import { useBookings } from '../../hooks/useBookings';
import { fadeUp, StatCard, statusMeta } from '../../components/dashboard/shared';
import FleetCard from '../../components/dashboard/FleetCard';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=100';

export default function AgencyDashboard() {
  const { user } = useAuth();
  const { dbUser } = useUserRole();
  const carsQ = useCars({ owner: user?.email });
  const bookingsQ = useBookings({ owner: user?.email });
  const deleteCar = useDeleteCar();
  const updateCar = useUpdateCar();

  const cars = carsQ.data || [];
  const bookings = bookingsQ.data || [];
  const isLoading = carsQ.isLoading || bookingsQ.isLoading;
  const isError = carsQ.isError || bookingsQ.isError;

  const revenue = bookings.reduce((s, b) => s + b.total, 0);
  const avgRating = cars.length ? (cars.reduce((s, c) => s + (c.rating || 0), 0) / cars.length).toFixed(1) : '—';

  const stats = [
    { label: 'Fleet Size', value: cars.length, sub: `${cars.filter(c => c.available).length} available`, icon: Car, color: 'brand', cornerIcon: TrendingUp },
    { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, sub: 'from your cars', icon: DollarSign, color: 'emerald', cornerIcon: TrendingUp },
    { label: 'Active Bookings', value: bookings.filter(b => b.status === 'active').length, sub: 'currently rented', icon: CalendarCheck, color: 'blue', cornerIcon: TrendingUp },
    { label: 'Avg. Rating', value: avgRating, sub: 'across vehicles', icon: Star, color: 'amber', cornerIcon: TrendingUp },
  ];

  const remove = async (car) => {
    const ok = await confirmDialog({
      title: 'Remove this car?',
      text: `${car.name} will be removed from your fleet and delisted.`,
      confirmText: 'Remove',
    });
    if (!ok) return;
    try {
      await deleteCar.mutateAsync(car.id);
      toast.success('Car removed', car.name);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  const toggleStatus = async (car) => {
    try {
      await updateCar.mutateAsync({ id: car.id, available: !car.available });
      toast.success(car.available ? 'Marked as rented' : 'Marked as available', car.name);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Agency Partner</p>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">{dbUser?.name || user?.displayName || 'Your Agency'}</h1>
        </div>
        <Link to="/dashboard/agency/add-car" className="btn-primary text-sm px-5 py-2.5">
          <Plus size={16} /> Add New Car
        </Link>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading your agency…" />
      ) : isError ? (
        <ErrorState onRetry={() => { carsQ.refetch(); bookingsQ.refetch(); }} />
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((s, i) => <StatCard key={s.label} {...s} index={i} />)}
          </div>

          {/* Fleet */}
          <motion.div {...fadeUp(5)} className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">My Fleet</h2>
              <Link to="/dashboard/agency/fleet" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Manage all</Link>
            </div>
            <div className="p-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cars.slice(0, 5).map((car, i) => (
                <FleetCard
                  key={car.id}
                  car={car}
                  index={i}
                  editTo={`/dashboard/agency/edit-car/${car.id}`}
                  onToggleStatus={toggleStatus}
                  updating={updateCar.isPending}
                  onDelete={remove}
                  deleting={deleteCar.isPending}
                />
              ))}

              {/* Add Car CTA */}
              <Link
                to="/dashboard/agency/add-car"
                className="min-h-[200px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-[#1e2d47] flex flex-col items-center justify-center gap-3 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#131b2e] flex items-center justify-center group-hover:bg-brand-100 dark:group-hover:bg-brand-900/30 transition-colors">
                  <Plus size={22} className="text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                </div>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {cars.length === 0 ? 'Add your first car' : 'Add New Vehicle'}
                </p>
              </Link>
            </div>
          </motion.div>

          {/* Recent Bookings */}
          <motion.div {...fadeUp(6)} className="card overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-[#1e2d47] flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Bookings</h2>
              <Link to="/dashboard/agency/bookings" className="text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-2 transition-all">
                All Bookings <ArrowRight size={13} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-[#131b2e]">
              {bookings.length === 0 && (
                <p className="px-6 py-8 text-center text-slate-400 text-sm">No bookings for your cars yet.</p>
              )}
              {bookings.slice(0, 5).map((b, i) => {
                const s = statusMeta[b.status] || statusMeta.upcoming;
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
                    className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-[#0d1930] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <img src={b.carImage || FALLBACK_IMG} alt={b.carName} className="w-14 h-10 object-cover rounded-xl shrink-0" onError={e => { e.target.src = FALLBACK_IMG; }} />
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{b.carName}</p>
                        <p className="text-xs text-slate-400">{b.userName} · {b.pickupDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${s.bg} ${s.color}`}>{b.status}</span>
                      <span className="font-black text-brand-600 dark:text-brand-400">${b.total}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
