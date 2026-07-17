import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, HandHeart, HeartHandshake } from 'lucide-react';

export const RoleSelection = () => {
  const navigate = useNavigate();

  const selectRole = (role: 'requester' | 'volunteer') => {
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="pt-20 pb-16 px-6 bg-gradient-to-b from-primary/[0.07] to-transparent honeycomb-bg relative overflow-hidden flex flex-col items-center justify-center shrink-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20"
        >
          <Hexagon className="w-8 h-8 text-white fill-white/20" strokeWidth={2} />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-[32px] font-black tracking-tight text-stone-900 text-center"
        >
          Join Help Hive
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-lg font-semibold text-stone-500 mt-2 text-center"
        >
          How would you like to use the app?
        </motion.p>
      </header>

      <main className="flex-1 px-6 max-w-md mx-auto w-full -mt-6 relative z-10 flex flex-col gap-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => selectRole('requester')}
          className="w-full bg-white border-2 border-stone-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-primary/30 transition-all active:scale-[0.98] group text-left"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <HandHeart className="w-8 h-8 text-primary" strokeWidth={2} />
          </div>
          <div>
            <span className="block text-[22px] font-black text-stone-900 mb-1">I need help</span>
            <span className="block text-[15px] font-semibold text-stone-500">Ask your community for assistance</span>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => selectRole('volunteer')}
          className="w-full bg-white border-2 border-stone-100 rounded-[2rem] p-6 flex items-center gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-secondary/30 transition-all active:scale-[0.98] group text-left"
        >
          <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
            <HeartHandshake className="w-8 h-8 text-secondary" strokeWidth={2} />
          </div>
          <div>
            <span className="block text-[22px] font-black text-stone-900 mb-1">I want to help</span>
            <span className="block text-[15px] font-semibold text-stone-500">Support your neighbors in need</span>
          </div>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 pb-8"
        >
          <span className="text-[16px] font-semibold text-stone-500">Already have an account? </span>
          <button 
            className="text-[16px] font-black text-primary hover:underline p-2 min-h-[48px] min-w-[48px]" 
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </motion.div>
      </main>
    </div>
  );
};
