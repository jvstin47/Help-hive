import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, HandHeart } from 'lucide-react';

export const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-12">
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-stone-900 tracking-tight mb-4"
          >
            Welcome to Help Hive
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-stone-500 font-medium"
          >
            How would you like to use the app today? You can always change this later.
          </motion.p>
        </div>

        <div className="space-y-4">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/onboarding/requester')}
            className="w-full bg-white p-8 rounded-[2rem] border-2 border-stone-100 hover:border-primary hover:shadow-md transition-all text-left flex items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
              <HandHeart className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-stone-900 mb-1">I need help</h2>
              <p className="text-stone-500 font-medium text-lg leading-tight">Ask a neighbor for assistance.</p>
            </div>
          </motion.button>

          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/onboarding/volunteer')}
            className="w-full bg-white p-8 rounded-[2rem] border-2 border-stone-100 hover:border-secondary hover:shadow-md transition-all text-left flex items-center gap-6 group"
          >
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary transition-colors">
              <Heart className="w-8 h-8 text-secondary group-hover:text-white transition-colors" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-stone-900 mb-1">I want to help</h2>
              <p className="text-stone-500 font-medium text-lg leading-tight">Assist neighbors in your community.</p>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
