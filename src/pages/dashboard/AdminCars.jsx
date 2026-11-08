import { motion } from 'framer-motion';
import { Car, Info } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import { useCars, useDeleteCar } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import FleetCard from '../../components/dashboard/FleetCard';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

export default function AdminCars() {
  const { data: cars = [], isLoading, isError, refetch } = useCars({});
  const deleteCar = useDeleteCar();

  // Admin oversight: listings belong to the agencies that own them. The admin can
  // only remove a listing (moderation) — not edit details or change availability.
  const remove = async (car) => {
    const ok = await confirmDialog({
      title: 'Remove this listing?',
      text: `${car.name} will be permanently removed from the platform.`,
      confirmText: 'Remove',
    });
    if (!ok) return;
    try {
      await deleteCar.mutateAsync(car.id);
      toast.success('Listing removed', car.name);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Fleet</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All {cars.length} vehicles on the platform.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading fleet…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : cars.length === 0 ? (
        <EmptyState icon={Car} title="No cars" message="The fleet is empty." />
      ) : (
        <>
          <motion.div {...fadeUp(1)} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1930] rounded-xl p-3">
            <Info size={14} className="text-brand-500 shrink-0 mt-0.5" />
            Listings are managed by their owning agencies. As admin you can view and remove listings for moderation, but not edit them.
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cars.map((car, i) => (
              <FleetCard key={car.id} car={car} index={i} onDelete={remove} deleting={deleteCar.isPending} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
