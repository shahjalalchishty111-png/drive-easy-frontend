import { Loader2 } from 'lucide-react';

// Reusable loading spinner. `fullscreen` centers it in the viewport.
export default function Spinner({ fullscreen = false, label, className = '' }) {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 size={fullscreen ? 34 : 26} className="animate-spin text-brand-600 dark:text-brand-400" />
      {label && <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>}
    </div>
  );

  if (fullscreen) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>;
  }
  return <div className="py-16 flex items-center justify-center">{content}</div>;
}
