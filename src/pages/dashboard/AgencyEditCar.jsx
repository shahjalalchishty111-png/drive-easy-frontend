import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import { useCar, useUpdateCar } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import CarForm from '../../components/dashboard/CarForm';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

export default function AgencyEditCar() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: car, isLoading, isError, refetch } = useCar(id);
  const updateCar = useUpdateCar();

  if (isLoading) return <Spinner fullscreen label="Loading car…" />;
  if (isError) return <ErrorState onRetry={refetch} />;

  // Guard: an agency may only edit its own cars.
  if (!car || (car.ownerEmail && car.ownerEmail !== user.email)) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-3">Car not available</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This car doesn’t exist or isn’t part of your fleet.</p>
        <Link to="/dashboard/agency/fleet" className="btn-primary px-6 py-3">Back to Fleet</Link>
      </div>
    );
  }

  const handleSubmit = async (payload) => {
    await updateCar.mutateAsync({ id: car.id, ...payload });
    toast.success('Car updated', `${payload.name} has been saved.`);
    navigate('/dashboard/agency/fleet');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <Link to="/dashboard/agency/fleet" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-semibold mb-3 transition-colors">
          <ChevronLeft size={16} /> Back to Fleet
        </Link>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Edit Car</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Update details, pricing or availability for {car.name}.</p>
      </motion.div>

      <motion.div {...fadeUp(1)}>
        <CarForm defaultCar={car} onSubmit={handleSubmit} submitting={updateCar.isPending} submitLabel="Save Changes" />
      </motion.div>
    </div>
  );
}
