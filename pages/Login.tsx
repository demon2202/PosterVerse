
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, user } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";

  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in (or upon successful login), redirect
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(email, password, username, name);
      }
      // On success, 'user' state in context updates.
      // The useEffect above will trigger the redirect.
      // We purposefully DO NOT set isLoading(false) here to avoid
      // UI flash/reset right before the page unmounts/redirects.
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please try again.');
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setPassword('');
    // Keep email/username if user switches mode to correct a mistake
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md bg-neutral-900/50 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-10">
            <motion.h1 
                key={isLoginMode ? 'login-h1' : 'reg-h1'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold text-white mb-2"
            >
                {isLoginMode ? 'Welcome Back' : 'Join FrameShift'}
            </motion.h1>
            <p className="text-neutral-400">
                {isLoginMode ? 'Sign in to access your creative space' : 'Create an account to save and share'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-3 text-red-200 text-sm overflow-hidden"
                    >
                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Registration Fields */}
            <AnimatePresence>
                {!isLoginMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                    >
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Jane Doe" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 outline-none transition-all"
                                required={!isLoginMode}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Username</label>
                            <input 
                                type="text" 
                                placeholder="@janedoe" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 outline-none transition-all"
                                required={!isLoginMode}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
                    {isLoginMode ? 'Email or Username' : 'Email'}
                </label>
                <input 
                    type={isLoginMode ? "text" : "email"}
                    placeholder={isLoginMode ? "email@example.com or @username" : "email@example.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 outline-none transition-all placeholder-neutral-600"
                    disabled={isLoading}
                    required
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Password</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent focus:ring-1 outline-none transition-all placeholder-neutral-600"
                    disabled={isLoading}
                    required
                    minLength={6}
                />
            </div>

            <div className="pt-4">
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            {isLoginMode ? 'Log In' : 'Create Account'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </form>

        <div className="text-center mt-8 pt-6 border-t border-white/10">
            <button 
                onClick={toggleMode}
                className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2 w-full"
            >
                {isLoginMode ? (
                    <>Don't have an account? <span className="text-accent">Sign up</span></>
                ) : (
                    <>Already have an account? <span className="text-accent">Log in</span></>
                )}
            </button>
        </div>
      </motion.div>
    </div>
  );
};
