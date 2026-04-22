import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginErrorMessage = (err) => {
  const msg = (err?.message || '').toLowerCase();
  if (msg.includes('invalid credentials')) {
    return 'The email or password you entered is incorrect. Please try again.';
  }
  if (msg.includes('deactivated')) {
    return 'This account has been deactivated. Please contact support if you need help.';
  }
  return err?.message || 'We could not sign you in. Please check your details and try again.';
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const from = location.state?.from || '/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get('expired') === '1';
    let fromSession = false;
    try {
      fromSession = sessionStorage.getItem('phygital-auth-expired') === '1';
      if (fromSession) sessionStorage.removeItem('phygital-auth-expired');
    } catch {
      // ignore
    }
    if (fromQuery || fromSession) {
      toast.error('Your login session expired. Please sign in again.');
      if (fromQuery) {
        params.delete('expired');
        const next = params.toString();
        navigate(next ? `/login?${next}` : '/login', { replace: true });
      }
    }
  }, [location.search, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(loginErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white font-bold text-xl">Phygital</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 mt-2 text-sm">Sign in to manage your cards</p>
        </div>

        <div className="glass-card border border-white/10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              fullWidth
              loading={isLoading}
              iconRight={<ArrowRight size={16} />}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
