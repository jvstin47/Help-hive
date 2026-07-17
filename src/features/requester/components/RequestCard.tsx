import type { Request } from '@/types/database.types';
import { StatusBadge } from './StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, MapPin, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface RequestCardProps {
  request: Request;
  onClick: (id: string) => void;
  delay?: number;
}

export const RequestCard = ({ request, onClick, delay = 0 }: RequestCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="mb-4 overflow-hidden cursor-pointer hover:border-primary/20 hover:shadow-md transition-all focus-within:ring-4 focus-within:ring-primary/30 group"
        onClick={() => onClick(request.id)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(request.id);
          }
        }}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4 gap-4">
            <h3 className="text-xl font-bold text-foreground line-clamp-1 mr-2 group-hover:text-primary transition-colors tracking-tight">{request.title}</h3>
            <StatusBadge status={request.status} />
          </div>
          
          <p className="text-muted-foreground text-[17px] leading-relaxed mb-6 line-clamp-2">
            {request.description}
          </p>
          
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex flex-col gap-2">
              {request.preferred_time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-stone-400" />
                  <span className="text-base font-medium text-stone-600">{new Date(request.preferred_time).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-5 h-5 text-stone-400 flex-shrink-0" />
                <span className="text-base font-medium text-stone-600 truncate">{request.address}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors shrink-0">
              <ChevronRight className="w-6 h-6 text-stone-400 group-hover:text-primary transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
