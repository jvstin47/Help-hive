import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  onClick: () => void;
  colorClass?: string;
  delay?: number;
}

export const CategoryCard = ({ title, icon: Icon, onClick, colorClass = "bg-primary/10 text-primary", delay = 0 }: CategoryCardProps) => {
  return (
    <motion.button 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-stone-100/50 hover:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 w-full h-full relative overflow-hidden group ${colorClass}`}
      aria-label={`Request ${title}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <Icon className="w-10 h-10 mb-4 stroke-[2.5px]" />
      <span className="text-xl font-bold tracking-tight text-center relative z-10">{title}</span>
    </motion.button>
  );
};
