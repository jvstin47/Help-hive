import { MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Request } from '@/types/database.types';
import { motion } from 'framer-motion';

interface VolunteerRequestCardProps {
  request: Request;
  requesterName?: string;
  requesterAvatar?: string;
  distance?: string;
  onViewDetails: (id: string) => void;
}

export const VolunteerRequestCard = ({ request, requesterName = "Local Neighbor", requesterAvatar, distance = "0.8 km", onViewDetails }: VolunteerRequestCardProps) => {
  const isHighPriority = request.priority === 'high' || request.priority === 'urgent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="mb-4 overflow-hidden border border-stone-100 hover:border-primary/30 transition-all shadow-sm group bg-white cursor-pointer" onClick={() => onViewDetails(request.id)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex items-center gap-4">
              <img 
                src={requesterAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${requesterName}`} 
                alt={requesterName} 
                className="w-14 h-14 rounded-full border-2 border-stone-100 bg-stone-50 object-cover"
              />
              <div>
                <h3 className="font-bold text-stone-900 flex items-center gap-1.5 text-lg">
                  {requesterName} <ShieldCheck className="w-5 h-5 text-green-600" />
                </h3>
                <p className="text-[15px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-md inline-block mt-1 capitalize">{request.category}</p>
              </div>
            </div>
            {isHighPriority && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" /> Urgent
              </span>
            )}
          </div>
          
          <h4 className="text-xl font-bold text-stone-900 mb-3 line-clamp-1">{request.title}</h4>
          
          <div className="flex flex-wrap gap-5 text-[15px] text-stone-500 mb-6 font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-stone-400" />
              <span>{distance} away</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-stone-400" />
              <span>Just now</span>
            </div>
          </div>

          <Button 
            className="w-full h-12 text-[17px] font-bold rounded-xl bg-stone-50 text-primary hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
