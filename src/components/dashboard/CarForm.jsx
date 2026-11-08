import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Upload, Car, ArrowRight, X, Plus, Star } from 'lucide-react';
import toast from '../../lib/toast';

const categories = ['Luxury Sedan', 'Premium SUV', 'Sports Car', 'Convertible'];
const fuels = ['Electric', 'Hybrid', 'Petrol', 'Diesel', 'V8 Petrol'];

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const uploadToImgBB = async (f) => {
  const fd = new FormData();
  fd.append('image', f);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, { method: 'POST', body: fd });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Image upload failed');
  return json.data.display_url;
};

/**
 * Reusable add/edit car form with MULTI-IMAGE support.
 * @param {object|null} defaultCar  existing car when editing (prefills fields + images)
 * @param {(payload)=>Promise} onSubmit  receives the assembled car payload (images resolved to an array)
 * @param {boolean} submitting  true while the parent mutation is in flight
 * @param {string} submitLabel  primary button label
 */
export default function CarForm({ defaultCar = null, onSubmit, submitting = false, submitLabel = 'Save Car' }) {
  const fileRef = useRef(null);
  const isEdit = !!defaultCar;

  // Each image is { id, kind: 'url'|'file', url?, file?, preview? }. Order = display order (first is cover).
  const [images, setImages] = useState(() =>
    (defaultCar?.images || []).map((url) => ({ id: uid(), kind: 'url', url }))
  );
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [available, setAvailable] = useState(defaultCar?.available ?? true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: defaultCar?.name || '',
      brand: defaultCar?.brand || '',
      category: defaultCar?.category || categories[0],
      pricePerDay: defaultCar?.pricePerDay || '',
      seats: defaultCar?.seats || 4,
      fuel: defaultCar?.fuel || fuels[0],
      transmission: defaultCar?.transmission || 'Auto',
      acceleration: defaultCar?.acceleration || '',
      year: defaultCar?.year || new Date().getFullYear(),
      color: defaultCar?.color || '',
      location: defaultCar?.location || '',
      description: defaultCar?.description || '',
      features: defaultCar?.features?.join(', ') || '',
    },
  });

  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';
  const inputClass = 'input-base px-4';

  const addFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages((prev) => [...prev, ...files.map((file) => ({ id: uid(), kind: 'file', file, preview: URL.createObjectURL(file) }))]);
    e.target.value = ''; // allow selecting the same file again
  };

  const addUrl = () => {
    const u = urlInput.trim();
    if (!u) return;
    setImages((prev) => [...prev, { id: uid(), kind: 'url', url: u }]);
    setUrlInput('');
  };

  const removeImage = (id) => setImages((prev) => prev.filter((x) => x.id !== id));
  const makeCover = (id) => setImages((prev) => { const i = prev.find((x) => x.id === id); return i ? [i, ...prev.filter((x) => x.id !== id)] : prev; });

  const submit = async (data) => {
    if (images.length === 0) {
      return toast.warning('Add at least one image', 'Upload photos or paste image URLs.');
    }
    try {
      setUploading(true);
      // Resolve each image (upload files, keep URLs) preserving order.
      const resolved = await Promise.all(
        images.map((it) => (it.kind === 'file' ? uploadToImgBB(it.file) : Promise.resolve(it.url)))
      );
      setUploading(false);

      await onSubmit({
        name: data.name,
        brand: data.brand,
        category: data.category,
        pricePerDay: Number(data.pricePerDay),
        seats: Number(data.seats),
        fuel: data.fuel,
        transmission: data.transmission,
        acceleration: data.acceleration,
        year: Number(data.year),
        color: data.color,
        location: data.location,
        description: data.description,
        features: data.features ? data.features.split(',').map((s) => s.trim()).filter(Boolean) : [],
        images: resolved,
        available,
      });
    } catch (err) {
      setUploading(false);
      toast.error(isEdit ? 'Could not update car' : 'Could not add car', err.response?.data?.message || err.message);
    }
  };

  const busy = uploading || submitting;

  return (
    <form onSubmit={handleSubmit(submit)} className="card p-6 space-y-5">
      {/* Images (multiple) */}
      <div>
        <label className={labelClass}>Car Photos <span className="text-slate-400 normal-case font-medium">— first photo is the cover</span></label>

        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {images.map((img, i) => (
              <div key={img.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-[#0d1930] border border-slate-200 dark:border-[#1e2d47]">
                <img src={img.kind === 'file' ? img.preview : img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.opacity = 0.3; }} />
                {i === 0 && (
                  <span className="absolute top-1 left-1 text-[9px] font-black px-1.5 py-0.5 rounded bg-brand-600 text-white flex items-center gap-0.5">
                    <Star size={9} className="fill-white" /> COVER
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  {i !== 0 && (
                    <button type="button" onClick={() => makeCover(img.id)} title="Make cover" className="w-7 h-7 rounded-lg bg-white/90 text-slate-800 flex items-center justify-center hover:bg-white">
                      <Star size={13} />
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(img.id)} title="Remove" className="w-7 h-7 rounded-lg bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={addFiles} className="hidden" />
          <button type="button" onClick={() => fileRef.current.click()} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#1e2d47] text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
            <Upload size={15} /> Upload photos
          </button>
          <div className="flex-1 flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addUrl(); } }}
              className={inputClass}
              placeholder="…or paste image URL"
            />
            <button type="button" onClick={addUrl} className="btn-ghost px-4 shrink-0" aria-label="Add image URL"><Plus size={16} /></button>
          </div>
        </div>
        {images.length === 0 && (
          <div className="mt-3 w-full h-24 rounded-xl border border-dashed border-slate-200 dark:border-[#1e2d47] flex items-center justify-center text-slate-400">
            <Car size={26} />
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Car Name</label>
          <input {...register('name', { required: 'Required' })} className={inputClass} placeholder="Lumina Spectre X" />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Brand</label>
          <input {...register('brand', { required: 'Required' })} className={inputClass} placeholder="Lumina" />
          {errors.brand && <p className="mt-1 text-xs text-red-500">{errors.brand.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Category</label>
          <select {...register('category', { required: true })} className={inputClass}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Price / day ($)</label>
          <input type="number" {...register('pricePerDay', { required: 'Required', min: { value: 1, message: 'Must be > 0' } })} className={inputClass} placeholder="450" />
          {errors.pricePerDay && <p className="mt-1 text-xs text-red-500">{errors.pricePerDay.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Seats</label>
          <input type="number" {...register('seats', { required: true, min: 1 })} className={inputClass} placeholder="4" />
        </div>
        <div>
          <label className={labelClass}>Fuel</label>
          <select {...register('fuel')} className={inputClass}>
            {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Transmission</label>
          <input {...register('transmission')} className={inputClass} placeholder="Auto" />
        </div>
        <div>
          <label className={labelClass}>0-60</label>
          <input {...register('acceleration')} className={inputClass} placeholder="3.5s 0-60" />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input type="number" {...register('year')} className={inputClass} placeholder="2024" />
        </div>
        <div>
          <label className={labelClass}>Color</label>
          <input {...register('color')} className={inputClass} placeholder="Midnight Black" />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Location</label>
          <input {...register('location')} className={inputClass} placeholder="New York, NY" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register('description')} rows={3} className={`${inputClass} resize-none`} placeholder="What makes this car special…" />
      </div>

      <div>
        <label className={labelClass}>Features (comma separated)</label>
        <input {...register('features')} className={inputClass} placeholder="Heated Seats, Panoramic Roof, Autopilot" />
      </div>

      {/* Availability toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-[#0d1930]">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">Availability</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {available ? 'Listed and bookable by customers.' : 'Hidden from booking (marked as rented/off).'}
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
        </label>
      </div>

      <button type="submit" disabled={busy} className="btn-primary w-full py-4 justify-center disabled:opacity-60">
        {uploading ? 'Uploading photos…' : submitting ? 'Saving…' : <>{submitLabel} <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}
