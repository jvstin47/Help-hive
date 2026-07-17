import { useNavigate } from 'react-router-dom';
import { Compass, Zap, CheckCircle, Clock } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { VolunteerRequestCard } from '../components/VolunteerRequestCard';
import { Button } from '@/components/ui/button';
import { useRequests } from '@/contexts/RequestsContext';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  // TODO: [RequestsContext vs TanStack Query] This reads server-sourced request data (nearby requests list) from the Context rather than using TanStack Query queries.
  const { requests } = useRequests();

  const availableRequests = requests
    .filter(r => r.status === 'submitted')
    .sort((a, b) => {
      const priorityWeight: Record<string, number> = { urgent: 4, high: 3, normal: 2, low: 1 };
      const weightA = priorityWeight[a.priority] || 0;
      const weightB = priorityWeight[b.priority] || 0;
      
      if (weightA !== weightB) {
        return weightB - weightA; // Higher priority first
      }
      
      // If same priority, sort by preferred time (closest first)
      if (a.preferred_time && b.preferred_time) {
        return new Date(a.preferred_time).getTime() - new Date(b.preferred_time).getTime();
      }
      return 0;
    });

  const activeRequests = requests.filter(r => ['assigned', 'traveling', 'arrived', 'in_progress'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'completed');
  const firstName = profile?.full_name?.split(' ')[0] || 'Neighbor';
  const totalHelped = profile?.completed_tasks ?? completedRequests.length;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* Header */}
      <header className="relative pt-14 pb-8 px-6 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-b from-secondary/[0.07] to-transparent honeycomb-bg">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-lg font-black text-secondary tracking-tight">Help Hive</span>
          </div>
          {activeRequests.length > 0 && (
            <span className="text-xs font-bold bg-accent/15 text-accent px-3 py-1.5 rounded-full flex items-center gap-1.5 animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-accent" />
              {activeRequests.length} active
            </span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <p className="text-stone-500 font-bold text-base mb-1">{getGreeting()},</p>
          <h2 className="text-[2.6rem] font-black leading-tight text-foreground tracking-tight">
            {firstName} 🙌
          </h2>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3 mt-6 relative z-10"
        >
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-stone-100 shadow-sm text-center">
            <div className="text-2xl font-black text-secondary">{totalHelped}</div>
            <div className="text-xs font-bold text-stone-500 mt-0.5">Neighbors<br/>helped</div>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-stone-100 shadow-sm text-center">
            <div className="text-2xl font-black text-primary">{availableRequests.length}</div>
            <div className="text-xs font-bold text-stone-500 mt-0.5">Requests<br/>nearby</div>
          </div>
          <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-3 border border-stone-100 shadow-sm text-center">
            <div className="text-2xl font-black text-accent">{profile?.rating?.toFixed(1) ?? '5.0'}</div>
            <div className="text-xs font-bold text-stone-500 mt-0.5">Your<br/>rating</div>
          </div>
        </motion.div>
      </header>

      <main className="px-5 max-w-2xl mx-auto space-y-8 -mt-4 relative z-20">

        {/* Active assistance alert */}
        {activeRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-primary to-[#2A4E52] text-white rounded-[1.75rem] p-5 shadow-lg shadow-primary/20 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-sm text-white/70 uppercase tracking-wider mb-1">Active now</p>
              <p className="font-black text-lg leading-tight truncate">{activeRequests[0].title}</p>
            </div>
            <button
              onClick={() => navigate(`/volunteer/requests/${activeRequests[0].id}`)}
              className="bg-white text-primary font-black text-sm px-4 py-2 rounded-xl shrink-0 hover:bg-white/90 transition-colors"
            >
              Resume
            </button>
          </motion.div>
        )}

        {/* Nearby Requests */}
        <section>
          <div className="flex justify-between items-end mb-4 px-1">
            <h3 className="text-xl font-black text-stone-900">Nearby Requests</h3>
            <button
              onClick={() => navigate('/volunteer/requests')}
              className="text-secondary font-black hover:underline text-sm"
            >
              See all →
            </button>
          </div>

          {availableRequests.length > 0 ? (
            <div className="flex flex-col gap-3">
              {availableRequests.slice(0, 2).map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <VolunteerRequestCard
                    request={req}
                    requesterName="Community Member"
                    onViewDetails={(id) => navigate(`/volunteer/requests/${id}`)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-[2rem] border border-stone-100 shadow-sm">
              <CheckCircle className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
              <p className="text-lg font-black text-stone-700 mb-1">All caught up!</p>
              <p className="text-sm font-semibold text-stone-500">No requests nearby right now.<br/>We'll notify you when someone needs help.</p>
            </div>
          )}

          <Button
            className="w-full h-16 mt-4 text-lg font-black bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-3 rounded-2xl shadow-lg shadow-secondary/20 transition-transform active:scale-[0.98]"
            onClick={() => navigate('/volunteer/requests')}
          >
            <Compass className="w-6 h-6" />
            Discover All Needs
          </Button>
        </section>

        {/* Recent completions */}
        {completedRequests.length > 0 && (
          <section>
            <h3 className="text-xl font-black text-stone-900 mb-4 px-1">Recently Completed</h3>
            <div className="space-y-2">
              {completedRequests.slice(0, 2).map(req => (
                <div key={req.id} className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-stone-800 text-sm truncate">{req.title}</p>
                    <p className="text-xs font-semibold text-stone-400 mt-0.5">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(req.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav role="volunteer" />
    </div>
  );
};
