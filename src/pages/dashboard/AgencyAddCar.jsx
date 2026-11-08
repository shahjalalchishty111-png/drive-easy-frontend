import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import { useCreateCar } from '../../hooks/useCars';
import { fadeUp } from '../../components/dashboard/shared';
import CarForm from '../../components/dashboard/CarForm';

export default function AgencyAddCar() {
  const { user } = useAuth();
  const createCar = useCreateCar();
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    await createCar.mutateAsync({ ...payload, ownerEmail: user.email });
    toast.success('Car added!', `${payload.name} is now live in your fleet.`);
    navigate('/dashboard/agency/fleet');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Add New Car</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">List a vehicle in your fleet.</p>
      </motion.div>

      <motion.div {...fadeUp(1)}>
        <CarForm onSubmit={handleSubmit} submitting={createCar.isPending} submitLabel="Add Car to Fleet" />
      </motion.div>
    </div>
  );
}
