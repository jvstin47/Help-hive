import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ImpactStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  delay?: number;
}

export const ImpactStatCard = ({ title, value, icon: Icon, colorClass = "text-blue-600 bg-blue-50", delay = 0 }: ImpactStatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, type: "spring" }}
    >
      <Card className="border-transparent shadow-[0_4px_20px_rgba(0,0,0,0.04)] bg-white overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6 flex flex-col gap-4">
          <div className={`p-4 rounded-[1.25rem] w-fit ${colorClass}`}>
            <Icon className="w-8 h-8 stroke-[2.5px]" />
          </div>
          <div>
            <p className="text-4xl font-black text-stone-900 mb-1 tracking-tight">{value}</p>
            <h3 className="text-[13px] font-bold text-stone-500 uppercase tracking-wide">{title}</h3>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
