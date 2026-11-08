import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';

const LoginForm = () => {
    const [showPw, setShowPw] = useState(false);
    const { userLogin } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const inputClass = 'input-base';
    const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';

    const handleLogin = async (data) => {
        try {
            await userLogin(data.email, data.password);
            reset();
            toast.success('Welcome back!', 'You have logged in successfully.');
            navigate('/');
        } catch (error) {
            toast.error('Login failed', error.message || 'Invalid email or password.');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <div>
                <label className={labelClass}>Email Address</label>
                <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        {...register('email', {
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                        })}
                        type="email"
                        placeholder="you@example.com"
                        className={`${inputClass} pl-11 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Password
                    </label>
                    <a href="#" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        Forgot?
                    </a>
                </div>
                <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Minimum 6 characters' },
                        })}
                        type={showPw ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`${inputClass} pl-11 pr-12 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPw((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full py-4 justify-center text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isSubmitting ? 'Signing in…' : <> Login <ArrowRight size={18} /></>}
            </button>
        </form>
    );
};

export default LoginForm;
