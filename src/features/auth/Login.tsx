import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '@/utils/validations';
import { AuthService } from '@/services/auth/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/services/supabase/client';
import { motion } from 'framer-motion';
import { Hexagon, Eye, EyeOff, LogIn } from 'lucide-react';

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { mockLogin } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        if (import.meta.env.DEV) {
          mockLogin('requester');
        }
        navigate('/requester/dashboard');
        return;
      }

      await AuthService.signInWithEmail(data);

      // Fetch user's role from their profile to redirect correctly
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Login failed. Please try again.');

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const role = (profile as any)?.role || user.user_metadata?.role || 'requester';

      if (role === 'volunteer') {
        navigate('/volunteer/dashboard');
      } else {
        navigate('/requester/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with logo */}
      <div className="honeycomb-bg pt-10 pb-12 px-6 bg-gradient-to-b from-primary/[0.06] to-transparent relative">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-4 p-2 rounded-full hover:bg-black/5 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-700"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mt-6"
        >
          <div className="w-20 h-20 bg-primary rounded-[1.75rem] flex items-center justify-center shadow-lg shadow-primary/20 mb-5">
            <Hexagon className="w-10 h-10 text-white fill-white/20" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Help Hive</h1>
          <p className="text-stone-500 font-semibold text-lg mt-1">Kanjirappally's care network</p>
        </motion.div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 p-6 max-w-md mx-auto w-full"
      >
        <h2 className="text-3xl font-black text-foreground mb-8 tracking-tight">Welcome back</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {error && (
            <Alert variant="destructive" className="rounded-2xl">
              <AlertDescription className="font-semibold">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-base font-bold text-stone-700">Email Address</Label>
            <Input
              id="email"
              type="email"
              className="h-14 text-lg rounded-2xl border-2 border-stone-200 focus:border-primary bg-white font-semibold"
              placeholder="you@example.com"
              {...register('email')}
            />
            {errors.email && <p className="text-destructive text-base font-semibold">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-base font-bold text-stone-700">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="h-14 text-lg rounded-2xl border-2 border-stone-200 focus:border-primary bg-white font-semibold pr-14"
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-base font-semibold">{errors.password.message}</p>}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input type="checkbox" id="remember" className="w-5 h-5 rounded-md border-stone-300 text-primary focus:ring-primary" defaultChecked />
            <label htmlFor="remember" className="text-base font-semibold text-stone-600">Remember me next time</label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-16 text-xl font-black rounded-2xl mt-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 flex items-center gap-3 transition-transform active:scale-[0.98]"
          >
            <LogIn className="w-6 h-6" />
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center mt-4">
            <span className="text-stone-500 font-semibold">New to Help Hive? </span>
            <Button
              variant="link"
              className="p-0 text-base font-black text-primary"
              onClick={() => navigate('/role-selection')}
              type="button"
            >
              Create an account
            </Button>
          </div>

          {/* Demo credentials hint */}
          {import.meta.env.DEV && (
            <div className="mt-4 p-4 bg-accent/10 rounded-2xl border border-accent/20">
              <p className="text-base font-bold text-accent-foreground/80 text-stone-700 mb-2">Demo accounts:</p>
              <div className="space-y-1 text-base font-semibold text-stone-600">
                <p>🙋 Requester: <span className="text-primary font-black">ammachi@helphive.com</span></p>
                <p>🤝 Volunteer: <span className="text-secondary font-black">george@helphive.com</span></p>
                <p className="text-stone-400">Password: Password123!</p>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};
