import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthHero from './AuthHero';
import AuthMobileLogo from './AuthMobileLogo';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage = () => {
  const [mode, setMode] = useState('login');

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <AuthHero />

      <div className="flex items-center justify-center p-8 bg-slate-50 dark:bg-[#0b1326] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <AuthMobileLogo />

          <div className="mb-8">
            <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {mode === 'login'
                ? 'Enter your credentials to continue.'
                : 'Join thousands of premium members.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}
              className="text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              {mode === 'login' ? 'Create one' : 'Sign in'}
            </button>
          </p>

          <div className="flex justify-center gap-6 mt-8 opacity-40 hover:opacity-70 transition-opacity">
            {[['🔒', 'Secure'], ['🛡️', 'Privacy Protected'], ['🎧', '24/7 Support']].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="text-lg">{icon}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;