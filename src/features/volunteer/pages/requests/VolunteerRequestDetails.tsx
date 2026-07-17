import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, ShieldCheck, CheckCircle2, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SafetyBanner } from '../../components/SafetyBanner';
import { useRequests } from '@/contexts/RequestsContext';
import { motion, AnimatePresence } from 'framer-motion';

export const VolunteerRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: [RequestsContext vs TanStack Query] This reads and updates server-sourced request data (specific request details & workflow status mutations) from/to the Context rather than using TanStack Query.
  const { requests, updateRequestStatus } = useRequests();
  const request = requests.find(r => r.id === id) || requests[1];
  const [safetyChecked, setSafetyChecked] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  
  const workflowSteps = [
    { key: 'assigned', label: 'Accepted', action: 'Start Travel' },
    { key: 'traveling', label: 'Traveling', action: 'I Have Arrived' },
    { key: 'arrived', label: 'Arrived', action: 'Begin Assistance' },
    { key: 'in_progress', label: 'Helping', action: 'Mark Completed' },
    { key: 'completed', label: 'Done', action: null }
  ];

  const handleAccept = () => {
    if (request.id) updateRequestStatus(request.id, 'assigned', 'me');
  };

  const handleNextStep = () => {
    const currentIndex = workflowSteps.findIndex(s => s.key === request.status);
    
    // If we're clicking "Mark Completed", show the prompt instead of advancing immediately
    if (workflowSteps[currentIndex].action === 'Mark Completed' && !showCompletionPrompt) {
      setShowCompletionPrompt(true);
      return;
    }
    
    if (currentIndex >= 0 && currentIndex < workflowSteps.length - 1) {
      if (request.id) updateRequestStatus(request.id, workflowSteps[currentIndex + 1].key as any);
      setShowCompletionPrompt(false);
    }
  };

  const isUnassigned = request.status === 'submitted';
  const currentStepIndex = workflowSteps.findIndex(s => s.key === request.status);
  const activeStep = workflowSteps[currentStepIndex];

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 py-4 pt-10 flex items-center justify-between bg-white sticky top-0 z-50 border-b border-stone-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 -ml-3 rounded-full hover:bg-stone-100 transition-colors">
            <ArrowLeft className="w-7 h-7 text-stone-800" />
          </button>
          <h1 className="text-xl font-bold truncate text-stone-900 tracking-tight">{isUnassigned ? 'Request Details' : 'Active Assistance'}</h1>
        </div>
        {!isUnassigned && request.status !== 'completed' && (
          <button className="text-red-400 hover:text-red-600 p-2 -mr-2 transition-colors bg-red-50 rounded-full" aria-label="Report Issue">
            <AlertTriangle className="w-5 h-5" />
          </button>
        )}
      </header>

      <main className="p-5 max-w-2xl mx-auto space-y-6 mt-2 relative z-10">
        {isUnassigned && <SafetyBanner onAllChecked={setSafetyChecked} />}

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100">
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-stone-100">
            <img 
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${request.title}`} 
              alt="Requester" 
              className="w-[72px] h-[72px] rounded-full border-4 border-white shadow-sm bg-stone-50 object-cover"
            />
            <div>
              <h2 className="text-[22px] font-black text-stone-900 flex items-center gap-2 tracking-tight">
                Community Member <ShieldCheck className="w-5 h-5 text-secondary" />
              </h2>
              <p className="text-[15px] font-medium text-stone-500 mt-0.5">Verified Requester</p>
            </div>
          </div>

          <h3 className="text-[22px] font-display font-bold text-stone-900 mb-3 tracking-tight">{request.title}</h3>
          <p className="text-[19px] text-stone-700 leading-relaxed mb-8 font-medium">
            {request.description}
          </p>

          <div className="space-y-6 bg-stone-50 p-6 rounded-[1.5rem]">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
                <MapPin className="w-5 h-5 text-stone-400" />
              </div>
              <div className="pt-0.5">
                <p className="text-[13px] font-bold text-stone-500 uppercase tracking-wider mb-1">Location</p>
                <p className="text-[17px] font-semibold text-stone-900">{request.address}</p>
                <p className="text-[15px] text-primary font-bold mt-1.5 bg-primary/10 inline-block px-2 py-0.5 rounded-md">~0.8 km away (5 min drive)</p>
              </div>
            </div>
            {request.preferred_time && (
              <div className="flex items-start gap-4 mt-6 pt-6 border-t border-stone-200">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-stone-100">
                  <Clock className="w-5 h-5 text-stone-400" />
                </div>
                <div className="pt-0.5">
                  <p className="text-[13px] font-bold text-stone-500 uppercase tracking-wider mb-1">Preferred Time</p>
                  <p className="text-[17px] font-semibold text-stone-900">{new Date(request.preferred_time).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {!isUnassigned && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white p-7 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 mt-6 overflow-hidden">
              <h3 className="text-[22px] font-display font-bold text-stone-900 mb-8 tracking-tight">Workflow Status</h3>
              <div className="relative pl-10 space-y-10 pb-4">
                <div className="absolute left-[1.375rem] top-3 bottom-3 w-1 bg-stone-100 z-0 rounded-full"></div>
                <motion.div 
                  className="absolute left-[1.375rem] top-3 w-1 bg-accent z-0 rounded-full"
                  initial={{ height: 0 }}
                  animate={{ height: `${(currentStepIndex / (workflowSteps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                ></motion.div>
                
                {workflowSteps.map((step, i) => {
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="relative z-10 flex items-center gap-6">
                      <div className="absolute -left-[3rem] flex items-center justify-center">
                        {isCurrent ? (
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[1.75rem] h-[1.75rem] rounded-full border-[3px] border-accent bg-accent/20 flex items-center justify-center shadow-[0_0_15px_rgba(232,163,61,0.4)]"
                          />
                        ) : (
                          <div className={`w-[1.75rem] h-[1.75rem] rounded-full border-[3px] ${isCompleted ? 'bg-accent border-accent' : 'bg-stone-50 border-stone-200'} transition-colors duration-500 flex items-center justify-center`}>
                            {i < currentStepIndex && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        )}
                      </div>
                      <span className={`text-[19px] tracking-tight ${isCurrent ? 'text-stone-900 font-bold' : isCompleted ? 'text-stone-700 font-semibold' : 'text-stone-400 font-medium'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-stone-100 p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <AnimatePresence>
          {showCompletionPrompt && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 bg-stone-50 p-4 rounded-[1.5rem] border border-stone-200"
            >
              <h4 className="font-black text-[18px] text-stone-900 mb-2">Any notes for the community?</h4>
              <textarea 
                className="w-full bg-white border border-stone-200 rounded-xl p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-accent/20 min-h-[80px]"
                placeholder="Optional notes for the community..."
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="max-w-2xl mx-auto flex gap-4">
          {isUnassigned ? (
            <Button 
              disabled={!safetyChecked}
              className="w-full h-[72px] text-xl font-bold rounded-2xl bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-3 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              onClick={handleAccept}
            >
              <CheckCircle2 className="w-7 h-7" />
              Accept Request
            </Button>
          ) : request.status !== 'completed' ? (
            <>
              {!showCompletionPrompt && (
                <Button 
                  variant="outline"
                  className="h-[72px] w-[72px] shrink-0 rounded-2xl border-2 border-stone-200 text-stone-700 bg-white hover:bg-stone-50 flex items-center justify-center p-0 transition-transform active:scale-95"
                  onClick={() => navigate(`/volunteer/messages/${request.id}`)}
                  aria-label="Message Requester"
                >
                  <MessageCircle className="w-7 h-7" />
                </Button>
              )}
              <Button 
                className={`flex-1 h-[72px] text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95`}
                onClick={handleNextStep}
              >
                {showCompletionPrompt ? 'Confirm & Finish' : activeStep?.action}
              </Button>
            </>
          ) : (
            <Button 
              className="w-full h-[72px] text-xl font-bold rounded-2xl bg-stone-900 hover:bg-stone-800 text-white shadow-md transition-transform active:scale-95"
              onClick={() => navigate('/volunteer/dashboard')}
            >
              Return Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
