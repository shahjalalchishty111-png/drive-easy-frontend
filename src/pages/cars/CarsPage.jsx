import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useCars } from '../../hooks/useCars';
import CarCard from '../../components/CarCard';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const categories = ['All', 'Luxury Sedan', 'Premium SUV', 'Sports Car', 'Convertible'];
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function CarsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState(searchParams.get('type') || 'All');
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(800);
  const [showFilters, setShowFilters] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Debounce the free-text search so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 350);
    return () => clearTimeout(t);
  }, [query]);

  const params = useMemo(() => {
    const p = { sort };
    if (debouncedQuery) p.q = debouncedQuery;
    if (category !== 'All') p.category = category;
    if (availableOnly) p.available = 'true';
    if (maxPrice < 800) p.maxPrice = maxPrice;
    return p;
  }, [debouncedQuery, category, sort, availableOnly, maxPrice]);

  const { data: cars = [], isLoading, isError, isFetching, refetch } = useCars(params);

  const resetFilters = () => {
    setQuery(''); setCategory('All'); setSort('featured'); setMaxPrice(800); setAvailableOnly(false);
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 dark:bg-[#060e20] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-400 mb-3">Our Fleet</p>
            <h1 className="font-display text-4xl md:text-5xl font-black text-white mb-4">
              Find Your Perfect Car
            </h1>
            <p className="text-slate-400 max-w-lg">
              Browse our curated collection of premium vehicles, each maintained to perfection.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="input-base pl-11"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={15} />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-base pr-10 appearance-none min-w-[180px]"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={() => setShowFilters(o => !o)}
            className={`btn-ghost flex items-center gap-2 ${showFilters ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-300 dark:border-brand-700 text-brand-700 dark:text-brand-300' : ''}`}
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="card p-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Max Price: <span className="text-brand-600 dark:text-brand-400">${maxPrice}/day</span>
                  </label>
                  <input
                    type="range" min="100" max="800" step="50"
                    value={maxPrice}
                    onChange={e => setMaxPrice(+e.target.value)}
                    className="w-full accent-brand-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>$100</span><span>$800</span>
                  </div>
                </div>

                {/* Available Only */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={availableOnly} onChange={e => setAvailableOnly(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-brand-600 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                  </label>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available only</span>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="text-sm text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                category === cat
                  ? 'brand-gradient text-white shadow-md shadow-brand-600/25'
                  : 'bg-slate-100 dark:bg-[#131b2e] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1a2640]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{cars.length}</span> vehicles
            {isFetching && !isLoading && <span className="ml-2 text-xs text-brand-500">updating…</span>}
          </p>
        </div>

        {/* Grid / states */}
        {isLoading ? (
          <Spinner label="Loading vehicles…" />
        ) : isError ? (
          <ErrorState message="We couldn’t load the fleet right now." onRetry={refetch} />
        ) : cars.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car, i) => <CarCard key={car.id} car={car} index={i} />)}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No cars found"
            message="Try adjusting your filters or search term."
            action={<button onClick={resetFilters} className="btn-ghost text-sm px-5 py-2.5">Reset filters</button>}
          />
        )}
      </div>
    </div>
  );
}
