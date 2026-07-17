import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Sparkles, ShoppingBasket, Pill, Car, Users, MoreHorizontal } from 'lucide-react';
import { useRequests } from '@/contexts/RequestsContext';
import { useProfile } from '@/hooks/useProfile';
import { RequestCard } from '../components/RequestCard';
import { EmergencyFAB } from '../components/EmergencyFAB';
import { BottomNav } from '@/components/BottomNav';
import { motion } from 'framer-motion';

const QUICK_ACTIONS = [
  { id: 'grocery', label: 'Groceries', icon: ShoppingBasket, color: 'bg-secondary/10 text-secondary', path: '/requester/new-request?category=grocery' },
  { id: 'medication', label: 'Meds', icon: Pill, color: 'bg-primary/10 text-primary', path: '/requester/new-request?category=medication' },
  { id: 'transport', label: 'Transport', icon: Car, color: 'bg-accent/10 text-accent', path: '/requester/new-request?category=transport' },
  { id: 'companionship', label: 'Company', icon: Users, color: 'bg-rose-50 text-rose-500', path: '/requester/new-request?category=companionship' },
  { id: 'other', label: 'Other', icon: MoreHorizontal, color: 'bg-stone-100 text-stone-500', path: '/requester/new-request?category=other' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export const RequesterDashboard = () => {
  const navigate = useNavigate();
  // TODO: [RequestsContext vs TanStack Query] This reads server-sourced request data (active requests list) from the Context rather than using TanStack Query queries.
  const { requests } = useRequests();
  const { profile } = useProfile();

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const activeRequests = requests.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const completedCount = requests.filter(r => r.status === 'completed').length;

  return (
    <div className="min-h-screen bg-background pb-28 relative">
      {/* Header */}
      <header className="relative pt-14 pb-8 px-6 overflow-hidden rounded-b-[2.5rem] bg-gradient-to-b from-primary/[0.07] to-transparent honeycomb-bg">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-lg font-black text-primary tracking-tight">Help Hive</span>
          </div>
          {completedCount > 0 && (
            <span className="text-xs font-bold bg-secondary/10 text-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-secondary" />
              {completedCount} helped
            </span>
          )}
        </div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-stone-500 font-bold text-base mb-1">{getGreeting()},</p>
            <h2 className="text-[2.6rem] font-black leading-tight text-foreground tracking-tight">
              {firstName} 👋
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 mt-4 text-stone-500 font-semibold bg-white/70 backdrop-blur-sm px-3 py-2 rounded-full text-sm w-fit border border-stone-100 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>2 neighbors helped someone nearby today</span>
          </motion.div>
        </div>
      </header>

      <main className="px-5 max-w-2xl mx-auto -mt-4 relative z-20 space-y-8">

        {/* Big CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          onClick={() => navigate('/requester/new-request')}
          className="w-full bg-gradient-to-br from-accent to-[#D4892A] text-white rounded-[2rem] p-8 text-left shadow-[0_12px_40px_rgba(232,163,61,0.3)] transition-transform active:scale-[0.98] flex items-end justify-between overflow-hidden group relative"
          style={{ minHeight: 170 }}
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-white/70 font-bold text-sm mb-2 uppercase tracking-wider">Ask for help</p>
            <h3 className="text-[1.8rem] font-black leading-tight">What do you need<br/>today?</h3>
          </div>
          <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 group-hover:bg-white/30 transition-colors shrink-0">
            <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
        </motion.button>

        {/* Quick action pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-lg font-black text-stone-900 mb-3 px-1">Quick request</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border border-stone-100 bg-white shadow-sm min-w-[80px] transition-transform active:scale-95 hover:shadow-md`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-stone-700 whitespace-nowrap">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Requests */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xl font-black text-stone-900">Active Requests</h3>
            {activeRequests.length > 0 && (
              <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {activeRequests.length} active
              </span>
            )}
          </div>

          {activeRequests.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeRequests.map((req, i) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  onClick={(id) => navigate(`/requester/requests/${id}`)}
                  delay={0.3 + i * 0.08}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center py-12 bg-white rounded-[2rem] border border-stone-100 shadow-sm"
            >
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-stone-100">
                <Heart className="w-10 h-10 text-stone-300" />
              </div>
              <p className="text-xl font-black text-stone-800 mb-2">You're all caught up!</p>
              <p className="text-base font-semibold text-stone-500 leading-relaxed">
                We're here whenever you need us.<br />Just tap above to ask a neighbor.
              </p>
            </motion.div>
          )}
        </section>
      </main>

      <EmergencyFAB />
      <BottomNav role="requester" />
    </div>
  );
};
