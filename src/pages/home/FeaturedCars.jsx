import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCars } from '../../hooks/useCars';
import CarCard from '../../components/CarCard';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

export default function FeaturedCars() {
  const { data: featured = [], isLoading, isError, refetch } = useCars({ featured: 'true' });

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="section-label mb-2">The Collection</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Featured Vehicles</h2>
        </div>
        <Link to="/cars" className="hidden sm:flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-sm hover:gap-3 transition-all">
          View all <ChevronRight size={16} />
        </Link>
      </div>

      {isLoading ? (
        <Spinner label="Loading featured vehicles…" />
      ) : isError ? (
        <ErrorState message="Couldn’t load featured vehicles." onRetry={refetch} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
        </div>
      )}

      <div className="mt-10 text-center sm:hidden">
        <Link to="/cars" className="btn-ghost px-8">View All Cars</Link>
      </div>
    </section>
  );
}
