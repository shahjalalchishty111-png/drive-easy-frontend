import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Lock, Mail, User, Check, Upload, ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from '../../lib/toast';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const roleOptions = [
    { value: 'user', label: 'Customer', desc: 'Rent premium vehicles' },
    { value: 'agency', label: 'Agency', desc: 'Manage your fleet' },
];

const presetAvatars = [
    { id: 'preset-1', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Felix' },
    { id: 'preset-2', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Lily' },
    { id: 'preset-3', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Max' },
    { id: 'preset-4', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Zoe' },
    { id: 'preset-5', url: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Alex' },
];

const RegisterForm = () => {
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRole, setSelectedRole] = useState('user');
    const [avatarMode, setAvatarMode] = useState('preset');
    const [selectedPreset, setSelectedPreset] = useState(presetAvatars[0].url);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const { createNewUser, updateUserProfile } = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    const password = watch('password');
    const inputClass = 'input-base';
    const labelClass = 'block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5';

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadedFile(file);
        // local blob just for the preview — not used as final URL
        setUploadPreview(URL.createObjectURL(file));
    };

    // Upload a File object to ImgBB and return the hosted display_url
    const uploadToImgBB = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
            { method: 'POST', body: formData }
        );

        const json = await res.json();

        if (!json.success) {
            throw new Error(json.error?.message || 'Image upload to ImgBB failed');
        }

        // data.display_url is the direct image URL per ImgBB docs
        return json.data.display_url;
    };

    const handleRegister = async (data) => {
        try {
            // 1. Resolve photoURL — upload to ImgBB only when user picked a file
            let photoURL = selectedPreset; // default: preset DiceBear URL (already hosted)
            if (avatarMode === 'upload') {
                if (!uploadedFile) {
                    return toast.warning('No photo selected', 'Please upload a photo or switch to Choose Avatar.');
                }
                setUploading(true);
                photoURL = await uploadToImgBB(uploadedFile);
                setUploading(false);
            }

            // 2. Create Firebase auth account
            await createNewUser(data.email, data.password);

            // 3. Update Firebase profile with the hosted URL
            await updateUserProfile({ displayName: data.name, photoURL });

            // 4. Save user to MongoDB
            await axiosPublic.post('/api/users', {
                name: data.name,
                email: data.email,
                role: selectedRole,
                photoURL,
            });

            // 5. Reset all local state
            reset();
            setSelectedRole('user');
            setAvatarMode('preset');
            setSelectedPreset(presetAvatars[0].url);
            setUploadedFile(null);
            setUploadPreview(null);
            toast.success('Account created!', `Welcome, ${data.name}. Your account is ready.`);
            navigate('/');
        } catch (error) {
            setUploading(false);
            toast.error('Registration failed', error.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">

            {/* Role Selector */}
            <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    I want to
                </p>
                <div className="grid grid-cols-2 gap-2">
                    {roleOptions.map(({ value, label, desc }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setSelectedRole(value)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedRole === value
                                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                : 'border-slate-200 dark:border-[#1e2d47] hover:border-slate-300 dark:hover:border-slate-600'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mb-2 ${selectedRole === value
                                ? 'border-brand-500 bg-brand-500'
                                : 'border-slate-300 dark:border-slate-600'
                                }`}>
                                {selectedRole === value && <Check size={10} className="text-white" />}
                            </div>
                            <p className="font-bold text-xs text-slate-900 dark:text-white">{label}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label className={labelClass}>Full Name</label>
                <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Minimum 2 characters' },
                        })}
                        type="text"
                        placeholder="John Doe"
                        className={`${inputClass} pl-11 ${errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    />
                </div>
                {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Email */}
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

            {/* Profile Photo */}
            <div>
                <p className={labelClass}>Profile Photo</p>
                <div className="flex gap-2 mb-4">
                    {[
                        { key: 'preset', label: 'Choose Avatar', icon: ImageIcon },
                        { key: 'upload', label: 'Upload Photo', icon: Upload },
                    ].map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setAvatarMode(key)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                avatarMode === key
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
                                    : 'border-slate-200 dark:border-[#1e2d47] text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            <Icon size={13} /> {label}
                        </button>
                    ))}
                </div>

                {avatarMode === 'preset' && (
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-200 dark:border-brand-800 shrink-0 flex items-center justify-center">
                            <img src={selectedPreset} alt="Selected avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {presetAvatars.map(({ id, url }) => (
                                <button
                                    key={id}
                                    type="button"
                                    onClick={() => setSelectedPreset(url)}
                                    className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all bg-slate-100 dark:bg-[#0d1930] ${
                                        selectedPreset === url
                                            ? 'border-brand-500 scale-110 shadow-md shadow-brand-500/30'
                                            : 'border-slate-200 dark:border-[#1e2d47] opacity-60 hover:opacity-100 hover:border-slate-300'
                                    }`}
                                >
                                    <img src={url} alt={id} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {avatarMode === 'upload' && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0d1930] border-2 border-slate-200 dark:border-[#1e2d47] shrink-0 flex items-center justify-center">
                            {uploadPreview ? (
                                <img src={uploadPreview} alt="Upload preview" className="w-full h-full object-cover" />
                            ) : (
                                <User size={24} className="text-slate-400" />
                            )}
                        </div>
                        <div className="flex-1 w-full">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#1e2d47] text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-brand-400 dark:hover:border-brand-600 hover:text-brand-600 dark:hover:text-brand-400 transition-all"
                            >
                                <Upload size={15} />
                                {uploadedFile ? uploadedFile.name : 'Click to upload image'}
                            </button>
                            {uploadedFile && (
                                <p className="text-[10px] text-slate-400 mt-1.5 pl-1">
                                    {(uploadedFile.size / 1024).toFixed(1)} KB · {uploadedFile.type}
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Password */}
            <div>
                <label className={labelClass}>Password</label>
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

            {/* Confirm Password */}
            <div>
                <label className={labelClass}>Confirm Password</label>
                <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (val) => val === password || 'Passwords do not match',
                        })}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`${inputClass} pl-11 pr-12 ${errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
                {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting || uploading}
                className="btn-primary w-full py-4 justify-center text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
                {uploading
                    ? 'Uploading photo…'
                    : isSubmitting
                    ? 'Creating account…'
                    : <> Create Account <ArrowRight size={18} /></>
                }
            </button>
        </form>
    );
};

export default RegisterForm;
