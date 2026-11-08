import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from '../../lib/toast';
import {
  Star, Users, Zap, Fuel, MapPin, ChevronLeft, Check, Calendar,
  Shield, Clock, ChevronRight, ChevronLeft as ChevLeft, Info
} from 'lucide-react';
import { useCar } from '../../hooks/useCars';
import { useReviews } from '../../hooks/useReviews';
import { serviceFee, SERVICE_FEE_PCT, SERVICE_FEE_NOTE } from '../../lib/pricing';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800';

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: car, isLoading, isError, refetch } = useCar(id);
  const { data: carReviews = [] } = useReviews(id);

  const [imgIdx, setImgIdx] = useState(0);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  if (isLoading) {
    return <div className="pt-20 min-h-screen"><Spinner fullscreen label="Loading car details…" /></div>;
  }

  if (isError) {
    return (
      <div className="pt-20 min-h-screen">
        <ErrorState message="We couldn’t load this car." onRetry={refetch} />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-4">Car not found</h2>
          <Link to="/cars" className="btn-primary">Back to Fleet</Link>
        </div>
      </div>
    );
  }

  const images = car.images?.length ? car.images : [FALLBACK_IMG];
  const today = new Date().toISOString().slice(0, 10);
  const days = pickupDate && returnDate
    ? Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000))
    : 1;
  const total = days * car.pricePerDay;

  const handleBook = () => {
    if (!pickupDate || !returnDate) {
      return toast.info('Select your dates', 'Please choose pickup and return dates to continue.');
    }
    const t0 = new Date(today);
    const p = new Date(pickupDate);
    const r = new Date(returnDate);
    if (p < t0) {
      return toast.error('Invalid pickup date', 'Pickup date cannot be in the past.');
    }
    if (r <= p) {
      return toast.error('Invalid return date', 'The return date must be after the pickup date.');
    }
    navigate(`/checkout/${car.id}?days=${days}&pickup=${pickupDate}&return=${returnDate}`);
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back */}
        <Link to="/cars" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 font-semibold mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Fleet
        </Link>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-[#0d1930]">
                <img
                  key={imgIdx}
                  src={images[imgIdx]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all"
                    >
                      <ChevLeft size={18} />
                    </button>
                    <button
                      onClick={() => setImgIdx(i => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-black tracking-wider px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-white border border-white/20">
                    {car.badge}
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 mt-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-20 h-14 rounded-xl overflow-hidden ring-2 transition-all ${imgIdx === i ? 'ring-brand-500' : 'ring-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Car Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="section-label mb-1">{car.category} · {car.year}</p>
                  <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{car.name}</h1>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < Math.floor(car.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                      ))}
                      <span className="text-sm font-bold text-slate-900 dark:text-white ml-1">{car.rating}</span>
                      <span className="text-sm text-slate-500">({car.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                      <MapPin size={14} /> {car.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-display text-4xl font-black text-brand-600 dark:text-brand-400">${car.pricePerDay}</span>
                  <span className="text-slate-400 text-sm block">/day</span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{car.description}</p>

              {/* Key Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Users, label: 'Seats', value: car.seats },
                  { icon: Zap, label: '0-60', value: car.acceleration },
                  { icon: Fuel, label: 'Fuel', value: car.fuel },
                  { icon: Shield, label: 'Trans.', value: car.transmission },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card p-4 text-center">
                    <Icon size={20} className="text-brand-600 dark:text-brand-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{label}</p>
                    <p className="font-bold text-slate-900 dark:text-white text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              {car.features?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Included Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {car.features.map(f => (
                      <div key={f} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center shrink-0">
                          <Check size={12} className="text-brand-600 dark:text-brand-400" />
                        </div>
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
                  Customer Reviews {carReviews.length > 0 && <span className="text-slate-400 font-normal">({carReviews.length})</span>}
                </h3>

                <div className="space-y-4 mb-6">
                  {carReviews.length === 0 && (
                    <p className="text-slate-500 dark:text-slate-400 text-sm">No reviews yet — be the first to share your experience.</p>
                  )}
                  {carReviews.map(r => (
                    <div key={r._id || r.id} className="card p-5">
                      <div className="flex items-start gap-4">
                        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-white text-sm">{r.name}</span>
                              {r.verified && <span className="ml-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">Verified</span>}
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[...Array(r.rating)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                          </div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm mb-1">{r.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{r.body}</p>
                          {r.date && <p className="text-xs text-slate-400 mt-2">{new Date(r.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-400 mt-2">
                  Rented this car? You can review it from your <Link to="/dashboard/user/reviews" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">dashboard</Link>.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Panel */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 card p-6 shadow-xl shadow-black/5 dark:shadow-black/30"
            >
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-6">Book This Car</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Pickup Date
                  </label>
                  <input type="date" min={today} value={pickupDate} onChange={e => setPickupDate(e.target.value)} className="input-base px-4" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Return Date
                  </label>
                  <input type="date" min={pickupDate || today} value={returnDate} onChange={e => setReturnDate(e.target.value)} className="input-base px-4" />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-slate-50 dark:bg-[#0d1930] rounded-xl p-4 mb-6 space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>${car.pricePerDay} × {days} day{days !== 1 ? 's' : ''}</span>
                  <span>${car.pricePerDay * days}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1" title={SERVICE_FEE_NOTE}>
                    Service fee ({SERVICE_FEE_PCT}%) <Info size={12} className="text-slate-400" />
                  </span>
                  <span>${serviceFee(total)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Insurance</span>
                  <span>Included</span>
                </div>
                <div className="border-t border-slate-200 dark:border-[#1e2d47] pt-2.5 flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-brand-600 dark:text-brand-400">${total + serviceFee(total)}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug pt-1">{SERVICE_FEE_NOTE}</p>
              </div>

              <button
                onClick={handleBook}
                disabled={!car.available}
                className={`w-full btn-primary justify-center py-4 ${!car.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {car.available ? <><Calendar size={17} /> Book Now</> : 'Currently Unavailable'}
              </button>

              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Shield, label: 'Insured' },
                  { icon: Clock, label: 'Instant' },
                  { icon: Check, label: 'No fees' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <Icon size={15} className="text-brand-600 dark:text-brand-400" />
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
