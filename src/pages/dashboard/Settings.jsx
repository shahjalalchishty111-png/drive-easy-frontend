import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { User, Mail, Shield, Save, Moon, Sun } from 'lucide-react';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import useTheme from '../../hooks/useTheme';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { fadeUp } from '../../components/dashboard/shared';

const roleLabels = { user: 'Customer', admin: 'Administrator', agency: 'Agency Partner' };

export default function Settings() {
  const { user, updateUserProfile } = useAuth();
  const { dbUser, role } = useUserRole();
  const { theme, toggleTheme } = useTheme();
  const axios = useAxiosPublic();
  const qc = useQueryClient();

  const [name, setName] = useState(dbUser?.name || user?.displayName || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await updateUserProfile({ displayName: name.trim() });
      if (dbUser?._id) {
        await axios.patch(`/api/users/${dbUser._id}`, { name: name.trim() });
      }
      await qc.invalidateQueries({ queryKey: ['user-role'] });
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your profile and preferences.</p>
      </motion.div>

      {/* Profile card */}
      <motion.form {...fadeUp(1)} onSubmit={handleSave} className="card p-6 space-y-5">
        <div className="flex items-center gap-4">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={name} className="w-16 h-16 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
          )}
          <div>
            <p className="font-bold text-slate-900 dark:text-white">{name || 'DriveEasy User'}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1">
              <Shield size={12} /> {roleLabels[role] || 'Customer'}
            </span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Full Name</label>
          <div className="relative">
            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={name} onChange={e => setName(e.target.value)} className="input-base pl-11" placeholder="Your name" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={user?.email || ''} disabled className="input-base pl-11 opacity-70 cursor-not-allowed" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Email is linked to your account and can’t be changed here.</p>
        </div>

        <button type="submit" disabled={saving} className="btn-primary px-6 py-3 disabled:opacity-60">
          {saving ? 'Saving…' : <>Save Changes <Save size={15} /></>}
        </button>
      </motion.form>

      {/* Preferences */}
      <motion.div {...fadeUp(2)} className="card p-6">
        <h2 className="font-display font-bold text-slate-900 dark:text-white mb-4">Preferences</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">Appearance</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
          </div>
          <button onClick={toggleTheme} className="btn-ghost text-sm px-4 py-2.5">
            {theme === 'dark' ? <><Sun size={15} /> Light</> : <><Moon size={15} /> Dark</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
