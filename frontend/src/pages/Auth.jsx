import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Flame, Mail, Lock, UserPlus, LogIn, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = isSignUp 
        ? await signUp({ email, password }) 
        : await signIn({ email, password });
      
      if (error) throw error;
      if (isSignUp) alert('Check your email for confirmation!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 bg-brand-primary rounded-3xl flex items-center justify-center mb-6 border border-white/10"
            >
              <Flame className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-3 text-center">
              Gemma<span className="text-brand-primary">Diet</span>
            </h1>
            <p className="text-text-secondary text-center max-w-[320px] text-base font-medium">
              {isSignUp ? 'Initialize your biological profile and begin your optimization journey.' : 'Welcome back to your personalized nutritional evolution.'}
            </p>
          </div>

          <Card glass className="p-10 border-white/10 shadow-2xl backdrop-blur-2xl">
            <form onSubmit={handleAuth} className="space-y-8">
              <div className="space-y-6">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={Mail}
                  autoComplete="email"
                />
                <Input
                  label="Secure Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon={Lock}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full py-5 text-lg font-bold"
                icon={isSignUp ? UserPlus : LogIn}
              >
                {isSignUp ? 'Create Profile' : 'Access Dashboard'}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-white/5 text-center">
              <p className="text-text-secondary text-sm font-medium">
                {isSignUp ? 'Already a member?' : 'New to biological optimization?'}
              </p>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="mt-3 text-brand-primary font-bold text-sm flex items-center justify-center gap-1.5 mx-auto hover:gap-2.5 transition-all group"
              >
                {isSignUp ? 'Sign In Instead' : 'Create Evolution Profile'}
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              </button>
            </div>
          </Card>

          <footer className="mt-12 text-center">
            <p className="text-[10px] uppercase font-bold text-text-muted tracking-[0.2em]">
              Powered by Gemma 3 Neural Engine • Secure & Private
            </p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
