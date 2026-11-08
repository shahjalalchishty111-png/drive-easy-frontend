import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from '../../lib/toast';
import { ChevronLeft, Shield, CreditCard, User, MapPin, Check, Lock, Info } from 'lucide-react';
import { useCar } from '../../hooks/useCars';
import { useCreateBooking } from '../../hooks/useBookings';
import useAuth from '../../hooks/useAuth';
import { serviceFee, SERVICE_FEE_PCT, SERVICE_FEE_NOTE } from '../../lib/pricing';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';

const steps = ['Details', 'Payment', 'Confirmation'];
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200';

export default function CheckoutPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { data: car, isLoading, isError, refetch } = useCar(id);
  const createBooking = useCreateBooking();

  const days = parseInt(searchParams.get('days') || '1', 10);
  const pickup = searchParams.get('pickup') || '';
  const ret = searchParams.get('return') || '';

  const [step, setStep] = useState(0);
  const [confirmedId, setConfirmedId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '', address: '', city: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });

  if (isLoading) return <div className="pt-24"><Spinner fullscreen label="Loading checkout…" /></div>;
  if (isError) return <div className="pt-24"><ErrorState onRetry={refetch} /></div>;
  if (!car) return <div className="pt-24 text-center">Car not found. <Link to="/cars" className="text-brand-600">Go back</Link></div>;

  const subtotal = car.pricePerDay * days;
  const fee = serviceFee(subtotal);
  const total = subtotal + fee;

  const set = (k) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [k]: value }));
    setErrors(prev => (prev[k] ? { ...prev, [k]: undefined } : prev));
  };

  // Format helpers
  const onCardNumber = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    set('cardNumber')({ target: { value: digits.replace(/(.{4})/g, '$1 ').trim() } });
  };
  const onExpiry = (e) => {
    let d = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (d.length >= 3) d = `${d.slice(0, 2)}/${d.slice(2)}`;
    set('expiry')({ target: { value: d } });
  };
  const onCvv = (e) => set('cvv')({ target: { value: e.target.value.replace(/\D/g, '').slice(0, 4) } });

  const validateDetails = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    const digits = form.cardNumber.replace(/\D/g, '');
    if (!form.cardName.trim()) e.cardName = 'Required';
    if (digits.length !== 16) e.cardNumber = 'Enter a 16-digit card number';
    const m = form.expiry.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) {
      e.expiry = 'Use MM/YY';
    } else {
      const mm = +m[1], yy = +m[2];
      if (mm < 1 || mm > 12) e.expiry = 'Invalid month';
      else if (new Date(2000 + yy, mm, 1) <= new Date()) e.expiry = 'Card expired';
    }
    if (!/^\d{3,4}$/.test(form.cvv.trim())) e.cvv = '3–4 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validateDetails()) setStep(1);
    else toast.error('Missing details', 'Please complete the required fields.');
  };

  const handleConfirm = async () => {
    if (!validatePayment()) {
      return toast.error('Payment details required', 'Enter valid card information to confirm.');
    }
    try {
      const booking = await createBooking.mutateAsync({
        carId: car.id,
        userEmail: user.email,
        userName: user.displayName || `${form.firstName} ${form.lastName}`.trim() || user.email,
        pickupDate: pickup,
        returnDate: ret,
      });
      setConfirmedId(booking.id);
      setStep(2);
      toast.success('Booking confirmed!', `Your ${car.name} is reserved.`);
    } catch (err) {
      toast.error('Booking failed', err.response?.data?.message || err.message || 'Please try again.');
    }
  };

  const inputClass = 'input-base px-4';
  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';
  const cls = (k) => `${inputClass} ${errors[k] ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`;
  const Err = ({ k }) => (errors[k] ? <p className="mt-1 text-xs text-red-500">{errors[k]}</p> : null);

  return (
    <div className="pt-20 min-h-screen bg-slate-50 dark:bg-[#0b1326]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to={`/cars/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 font-semibold mb-8 transition-colors">
          <ChevronLeft size={16} /> Back to Car
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                  i < step ? 'bg-brand-600 border-brand-600 text-white' :
                  i === step ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400' :
                  'border-slate-300 dark:border-slate-700 text-slate-400'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className="text-sm font-semibold hidden sm:block">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-px w-8 sm:w-12 mx-1 sm:mx-2 ${i < step ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                    <User size={20} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Personal Details</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>First Name</label><input className={cls('firstName')} placeholder="John" value={form.firstName} onChange={set('firstName')} /><Err k="firstName" /></div>
                  <div><label className={labelClass}>Last Name</label><input className={cls('lastName')} placeholder="Doe" value={form.lastName} onChange={set('lastName')} /><Err k="lastName" /></div>
                  <div><label className={labelClass}>Email</label><input className={cls('email')} type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} /><Err k="email" /></div>
                  <div><label className={labelClass}>Phone</label><input className={cls('phone')} placeholder="+1 (555) 000-0000" value={form.phone} onChange={set('phone')} /><Err k="phone" /></div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-[#1e2d47]">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                    <MapPin size={20} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Delivery Address</h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><label className={labelClass}>Street Address</label><input className={cls('address')} placeholder="123 Main St" value={form.address} onChange={set('address')} /><Err k="address" /></div>
                  <div><label className={labelClass}>City</label><input className={cls('city')} placeholder="New York" value={form.city} onChange={set('city')} /><Err k="city" /></div>
                </div>

                <button onClick={handleContinue} className="btn-primary w-full py-4 justify-center">
                  Continue to Payment →
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center">
                    <CreditCard size={20} className="text-brand-600 dark:text-brand-400" />
                  </div>
                  <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div><label className={labelClass}>Name on Card</label><input className={cls('cardName')} placeholder="John Doe" value={form.cardName} onChange={set('cardName')} /><Err k="cardName" /></div>
                  <div>
                    <label className={labelClass}>Card Number</label>
                    <input className={cls('cardNumber')} inputMode="numeric" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={onCardNumber} />
                    <Err k="cardNumber" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelClass}>Expiry</label><input className={cls('expiry')} inputMode="numeric" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={onExpiry} /><Err k="expiry" /></div>
                    <div><label className={labelClass}>CVV</label><input className={cls('cvv')} inputMode="numeric" placeholder="•••" maxLength={4} value={form.cvv} onChange={onCvv} /><Err k="cvv" /></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1930] rounded-xl p-3">
                  <Lock size={13} className="text-emerald-500 shrink-0" />
                  Your payment information is encrypted and secured with 256-bit SSL. This is a demo — no card is charged.
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-ghost flex-1 py-4 justify-center">← Back</button>
                  <button onClick={handleConfirm} disabled={createBooking.isPending} className="btn-primary flex-1 py-4 justify-center disabled:opacity-60">
                    {createBooking.isPending ? 'Confirming…' : 'Confirm Booking →'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="card p-6 sm:p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="w-20 h-20 brand-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-600/30"
                >
                  <Check size={36} className="text-white" />
                </motion.div>
                <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-3">Booking Confirmed!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                  Your booking for the <span className="font-bold text-slate-900 dark:text-white">{car.name}</span> has been confirmed.
                </p>
                <p className="text-slate-400 text-sm mb-8">A confirmation email has been sent to your inbox.</p>

                <div className="bg-slate-50 dark:bg-[#0d1930] rounded-2xl p-5 text-left mb-8">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      ['Booking ID', confirmedId || '—'],
                      ['Vehicle', car.name],
                      ['Pickup', pickup || 'TBD'],
                      ['Return', ret || 'TBD'],
                      ['Duration', `${days} day${days !== 1 ? 's' : ''}`],
                      ['Total Paid', `$${total}`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-slate-400 text-xs">{label}</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/dashboard/user/bookings" className="btn-primary px-8 py-3">View My Bookings</Link>
                  <Link to="/cars" className="btn-ghost px-8 py-3">Browse More Cars</Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">Order Summary</h3>

              <div className="flex gap-4 mb-5 p-4 bg-slate-50 dark:bg-[#0d1930] rounded-xl">
                <img src={car.images?.[0]} alt={car.name} className="w-20 h-16 object-cover rounded-lg shrink-0"
                  onError={e => { e.target.src = FALLBACK_IMG; }} />
                <div>
                  <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-0.5">{car.category}</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{car.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{car.year} · {car.color}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-sm border-t border-slate-100 dark:border-[#1e2d47] pt-4">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>${car.pricePerDay}/day × {days}</span><span>${subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1" title={SERVICE_FEE_NOTE}>
                    Service fee ({SERVICE_FEE_PCT}%) <Info size={12} className="text-slate-400" />
                  </span>
                  <span>${fee}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Insurance</span><span className="text-emerald-500">Included</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-100 dark:border-[#1e2d47] pt-2.5">
                  <span>Total</span>
                  <span className="text-brand-600 dark:text-brand-400 text-lg">${total}</span>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#0d1930] rounded-xl p-3">
                <Info size={13} className="text-brand-500 shrink-0 mt-0.5" />
                <span>{SERVICE_FEE_NOTE}</span>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Shield size={13} className="text-brand-500" /> Free cancellation up to 48h before pickup
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
