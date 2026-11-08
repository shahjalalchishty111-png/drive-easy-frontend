import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Car, Search } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: '', date: '', type: '' });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?location=${search.location}&type=${search.type}`);
  };

  return (
    <section className="relative z-10 -mt-8 max-w-6xl mx-auto px-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-[#131b2e] rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-slate-200 dark:border-[#1e2d47] p-6"
      >
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <MapPin size={12} /> Location
            </label>
            <input
              type="text"
              placeholder="Where to?"
              value={search.location}
              onChange={e => setSearch(s => ({ ...s, location: e.target.value }))}
              className="input-base"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Calendar size={12} /> Pickup Date
            </label>
            <input
              type="date"
              value={search.date}
              onChange={e => setSearch(s => ({ ...s, date: e.target.value }))}
              className="input-base"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Car size={12} /> Car Type
            </label>
            <select
              value={search.type}
              onChange={e => setSearch(s => ({ ...s, type: e.target.value }))}
              className="input-base"
            >
              <option value="">All Types</option>
              <option value="Luxury Sedan">Luxury Sedan</option>
              <option value="Premium SUV">Premium SUV</option>
              <option value="Sports Car">Sports Car</option>
              <option value="Convertible">Convertible</option>
            </select>
          </div>
          <button type="submit" className="btn-primary h-12 mt-auto">
            <Search size={17} /> Search
          </button>
        </form>
      </motion.div>
    </section>
  );
}
