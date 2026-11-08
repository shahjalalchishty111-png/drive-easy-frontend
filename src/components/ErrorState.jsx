import { AlertTriangle, RefreshCw } from 'lucide-react';

// Friendly error panel with an optional retry button (pass a refetch fn).
export default function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn’t load this content. Please try again.',
  onRetry,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-4 py-16 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost text-sm px-5 py-2.5">
          <RefreshCw size={15} /> Try again
        </button>
      )}
    </div>
  );
}
