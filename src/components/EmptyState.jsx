import { Inbox } from 'lucide-react';

// Generic empty-state placeholder. Pass an icon component, title, message and optional action node.
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center gap-4 py-16 ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#131b2e] flex items-center justify-center">
        <Icon size={28} className="text-slate-400" />
      </div>
      <div>
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-1">{title}</h3>
        {message && <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">{message}</p>}
      </div>
      {action}
    </div>
  );
}
