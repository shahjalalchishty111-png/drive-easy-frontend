import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Car, Plus } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import useAuth from '../../hooks/useAuth';
import { useCars, useDeleteCar, useUpdateCar } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import FleetCard from '../../components/dashboard/FleetCard';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

export default function AgencyFleet() {
  const { user } = useAuth();
  const { data: cars = [], isLoading, isError, refetch } = useCars({ owner: user?.email });
  const deleteCar = useDeleteCar();
  const updateCar = useUpdateCar();

  const toggleStatus = async (car) => {
    try {
      await updateCar.mutateAsync({ id: car.id, available: !car.available });
      toast.success(car.available ? 'Marked as rented' : 'Marked as available', car.name);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

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

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">My Fleet</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{cars.length} vehicle{cars.length !== 1 ? 's' : ''} listed.</p>
        </div>
        <Link to="/dashboard/agency/add-car" className="btn-primary text-sm px-5 py-2.5"><Plus size={16} /> Add Car</Link>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading your fleet…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : cars.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No cars yet"
          message="Add your first vehicle to start receiving bookings."
          action={<Link to="/dashboard/agency/add-car" className="btn-primary text-sm px-6 py-2.5"><Plus size={16} /> Add Car</Link>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cars.map((car, i) => (
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
        </div>
      )}
    </div>
  );
}
