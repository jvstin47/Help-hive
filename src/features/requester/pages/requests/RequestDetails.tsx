import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, MapPin, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '../../components/StatusBadge';
import { VolunteerTrustCard } from '../../components/VolunteerTrustCard';
import { MOCK_VOLUNTEER } from '@/utils/seed';
import { useRequests } from '@/contexts/RequestsContext';
import { motion } from 'framer-motion';

export const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: [RequestsContext vs TanStack Query] This reads server-sourced request data (specific request details) from the Context rather than using TanStack Query queries.
  const { requests } = useRequests();
  // Using mock data for immediate UI rendering without backend latency for the senior experience review
  const req = requests.find(r => r.id === id) || requests[0];

  const statuses = [
    { key: 'submitted', label: 'Requested' },
    { key: 'assigned', label: 'Found' },
    { key: 'traveling', label: 'On way' },
    { key: 'completed', label: 'Done' }
  ];

  const currentIndex = statuses.findIndex(s => s.key === req.status) !== -1 
    ? statuses.findIndex(s => s.key === req.status) 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="px-6 py-4 pt-10 flex items-center gap-4 bg-white sticky top-0 z-20 border-b border-stone-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)]">
        <button onClick={() => navigate('/requester/dashboard')} className="p-3 -ml-3 rounded-full hover:bg-stone-100 transition-colors" aria-label="Back to Dashboard">
          <ArrowLeft className="w-7 h-7 text-stone-800" />
        </button>
        <h1 className="text-xl font-bold truncate text-stone-900 tracking-tight">{req.title}</h1>
      </header>

      <main className="p-5 max-w-2xl mx-auto space-y-6 mt-2 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100/80"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[22px] font-display font-bold tracking-tight text-stone-900">Status</h2>
            <StatusBadge status={req.status} />
          </div>
          
          <div className="flex justify-center items-center py-8">
            <div className="relative flex items-center justify-center w-64 h-64">
              {statuses.map((s, i) => {
                const isCompleted = i <= currentIndex;
                const isCurrent = i === currentIndex;
                const size = 64 + (i * 48); // Rings get progressively larger
                return (
                  <motion.div
                    key={s.key}
                    className={`absolute rounded-full border-2 flex items-center justify-center transition-colors duration-700`}
                    style={{ width: size, height: size }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div 
                      className={`w-full h-full rounded-full border-[3px] transition-all duration-1000
                        ${isCompleted ? 'border-accent bg-accent/5' : 'border-stone-100 bg-transparent'}
                        ${isCurrent ? 'shadow-[0_0_20px_rgba(232,163,61,0.3)] border-accent animate-pulse-slow' : ''}
                      `} 
                    />
                  </motion.div>
                );
              })}
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-display font-bold text-accent bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                  {statuses[currentIndex]?.label}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {req.volunteer_id && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="space-y-4 pt-2">
            <h3 className="text-[22px] font-bold text-stone-900 px-2 tracking-tight">Your Volunteer</h3>
            <VolunteerTrustCard volunteer={MOCK_VOLUNTEER} />
            
            <Button 
              className="w-full h-[72px] text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 flex items-center justify-center gap-3 mt-4 shadow-[0_8px_30px_rgba(55,48,163,0.25)] transition-transform active:scale-95 text-white"
              onClick={() => navigate(`/requester/messages/${req.id}`)}
            >
              <MessageCircle className="w-7 h-7" />
              Message Volunteer
            </Button>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 mt-6">
          <h3 className="text-[22px] font-display font-bold text-stone-900 mb-4 tracking-tight">Request Details</h3>
          <p className="text-[19px] text-stone-700 mb-8 leading-relaxed font-medium">{req.description}</p>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <strong className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Address</strong> 
                <span className="text-[19px] font-medium text-stone-900">{req.address}</span>
              </div>
            </div>
            {req.preferred_time && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-stone-400" />
                </div>
                <div>
                  <strong className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Preferred Time</strong> 
                  <span className="text-[19px] font-medium text-stone-900">{new Date(req.preferred_time).toLocaleString()}</span>
                </div>
              </div>
            )}
            {req.special_instructions && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6 text-stone-400" />
                </div>
                <div>
                  <strong className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Instructions</strong> 
                  <span className="text-[19px] font-medium text-stone-900">{req.special_instructions}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        <div className="pt-8 pb-12 flex justify-center">
          <button className="text-stone-400 text-lg font-medium hover:text-stone-600 transition-colors underline underline-offset-4 decoration-stone-300">
            Something feels wrong?
          </button>
        </div>

      </main>
    </div>
  );
};
