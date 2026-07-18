import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerSchema } from '@/utils/validations';
import { AuthService } from '@/services/auth/auth.service';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Hexagon, Eye, EyeOff, UserPlus, HandHeart, HeartHandshake } from 'lucide-react';

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') as 'requester' | 'volunteer') || 'requester';
  const { mockLogin } = useAuth();
  
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: role,
    }
  });

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        mockLogin(role);
        navigate(`/${role}/dashboard`);
        return;
      }
      await AuthService.signUp(data);
      navigate(`/${role}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const isRequester = role === 'requester';
  const RoleIcon = isRequester ? HandHeart : HeartHandshake;
  const roleColor = isRequester ? 'text-primary' : 'text-secondary';
  const roleBg = isRequester ? 'bg-primary/10' : 'bg-secondary/10';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="pt-10 pb-12 px-6 bg-gradient-to-b from-primary/[0.07] to-transparent honeycomb-bg relative overflow-hidden flex flex-col items-center justify-center shrink-0">
        <button onClick={() => navigate(-1)} className="absolute top-6 left-4 p-2 rounded-full hover:bg-black/5 transition-colors z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-stone-700"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20 mt-4"
        >
          <Hexagon className="w-7 h-7 text-white fill-white/20" strokeWidth={2} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-black tracking-tight text-stone-900 text-center mb-4"
        >
          Help Hive
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={`flex items-center gap-2 ${roleBg} ${roleColor} px-4 py-2 rounded-full`}
        >
          <RoleIcon className="w-5 h-5" />
          <span className="text-[15px] font-bold">Signing up to {isRequester ? 'get help' : 'volunteer'}</span>
        </motion.div>
      </header>

      <main className="flex-1 px-6 max-w-md mx-auto w-full relative z-10 flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 p-6 -mt-4 mb-8"
        >
          <h2 className="text-[22px] font-black text-stone-900 mb-6 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-stone-400" />
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-2xl text-[15px] font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-[15px] font-bold text-stone-700 ml-1">Full Name</label>
              <input 
                id="fullName" 
                className="w-full h-14 px-4 text-[17px] font-semibold text-stone-900 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50/50" 
                placeholder="Jane Doe"
                {...register('fullName')} 
              />
              {errors.fullName && <p className="text-destructive text-base font-semibold ml-1">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-[15px] font-bold text-stone-700 ml-1">Email Address</label>
              <input 
                id="email" 
                type="email" 
                className="w-full h-14 px-4 text-[17px] font-semibold text-stone-900 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50/50" 
                placeholder="you@example.com"
                {...register('email')} 
              />
              {errors.email && <p className="text-destructive text-base font-semibold ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-[15px] font-bold text-stone-700 ml-1">Password</label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full h-14 pl-4 pr-12 text-[17px] font-semibold text-stone-900 rounded-2xl border-2 border-stone-200 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-stone-50/50" 
                  placeholder="Create a password"
                  {...register('password')} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-600 rounded-xl hover:bg-stone-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-base font-semibold ml-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-16 mt-4 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-4 pb-8"
        >
          <div>
            <span className="text-[16px] font-semibold text-stone-500">Already have an account? </span>
            <button 
              className="text-[16px] font-black text-primary hover:underline p-2 min-h-[48px] min-w-[48px]" 
              onClick={() => navigate('/login')}
              type="button"
            >
              Sign in
            </button>
          </div>
          <div>
            <button 
              className="text-[15px] font-bold text-stone-400 hover:text-stone-600 underline-offset-4 hover:underline p-2 min-h-[48px]" 
              onClick={() => navigate('/role-selection')} 
              type="button"
            >
              Change role
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
