import { motion } from 'framer-motion';
import { Trash2, Users as UsersIcon } from 'lucide-react';
import toast from '../../lib/toast';
import confirmDialog from '../../lib/confirm';
import { useUsers, useUpdateUser, useDeleteUser } from '../../hooks/useUsers';
import { fadeUp } from '../../components/dashboard/shared';
import useAuth from '../../hooks/useAuth';
import Spinner from '../../components/Spinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const roleDot = {
  admin: 'bg-red-500',
  agency: 'bg-emerald-500',
  user: 'bg-brand-500',
};

export default function AdminUsers() {
  const { user } = useAuth();
  const { data: users = [], isLoading, isError, refetch } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const changeRole = async (u, role) => {
    try {
      await updateUser.mutateAsync({ id: u._id, role });
      toast.success('Role updated', `${u.name} is now ${role}`);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  const remove = async (u) => {
    const ok = await confirmDialog({
      title: 'Delete this user?',
      text: `${u.name} (${u.email}) will be permanently removed.`,
      confirmText: 'Delete',
    });
    if (!ok) return;
    try {
      await deleteUser.mutateAsync(u._id);
      toast.success('User deleted', u.email);
    } catch (err) {
      toast.error('Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Users</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage accounts and roles.</p>
      </motion.div>

      {isLoading ? (
        <Spinner label="Loading users…" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users yet" message="Registered users will appear here." />
      ) : (
        <motion.div {...fadeUp(1)} className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#1e2d47]">
                  {['User', 'Email', 'Role', 'Joined', ''].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const isSelf = u.email === user?.email;
                  return (
                  <tr key={u._id} className="border-b border-slate-50 dark:border-[#131b2e] hover:bg-slate-50 dark:hover:bg-[#0d1930] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.name} className="w-9 h-9 rounded-xl object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl brand-gradient" />
                        )}
                        <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">{u.name}</span>
                        {isSelf && <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400">You</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">{u.email}</td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${roleDot[u.role] || roleDot.user}`} />
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => changeRole(u, e.target.value)}
                          disabled={isSelf}
                          title={isSelf ? "You can't change your own role" : undefined}
                          className="text-xs font-semibold capitalize rounded-lg border border-slate-200 dark:border-[#1e2d47] bg-white dark:bg-[#131b2e] text-slate-700 dark:text-slate-200 px-2.5 py-1.5 outline-none focus:border-brand-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <option value="user">User</option>
                          <option value="agency">Agency</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => remove(u)}
                        disabled={isSelf}
                        title={isSelf ? "You can't delete your own account" : 'Delete user'}
                        className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-slate-400"
                        aria-label="Delete user"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
