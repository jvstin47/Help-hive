import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle2, Mic, ShoppingBasket, Pill, Car, Heart, MoreHorizontal,MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { RequestService } from '@/services/request/request.service';
import type { RequestCategory } from '@/types/database.types';
import { useRequests } from '@/contexts/RequestsContext';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'grocery', title: 'Groceries', desc: 'Pick up a few items from the store', icon: ShoppingBasket, color: 'text-secondary' },
  { id: 'medication', title: 'Medication', desc: 'Pick up a prescription from the pharmacy', icon: Pill, color: 'text-primary' },
  { id: 'transport', title: 'Transport', desc: 'A ride to the clinic or hospital', icon: Car, color: 'text-accent' },
  { id: 'companionship', title: 'Company', desc: 'Someone to chat with or read to you', icon: Heart, color: 'text-rose-500' },
  { id: 'other', title: 'Something else', desc: 'Any other help you might need', icon: MoreHorizontal, color: 'text-stone-600' }
];

export const NewRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as RequestCategory) || 'grocery';
  const { user } = useAuth();
  // TODO: [RequestsContext vs TanStack Query] This writes server-sourced request data (submitting new requests) to the Context rather than using TanStack Query mutations.
  const { addRequest } = useRequests();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: initialCategory,
    description: '',
    address: 'Petta Junction, Kanjirappally', // Auto-filled for prototype
    urgency: 'today' as 'now' | 'today' | 'week',
  });

  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleVoiceInput = () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported in this browser. Please type your request.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setSpeechError("Microphone permission was denied. Please check your browser settings.");
      } else {
        setSpeechError("Could not hear you. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        updateForm({ 
          description: formData.description 
            ? `${formData.description.trim()} ${transcript}` 
            : transcript 
        });
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setSpeechError("Failed to start voice recording.");
      setIsListening(false);
    }
  };

  const updateForm = (updates: Partial<typeof formData>) => {
    const newData = { ...formData, ...updates };
    setFormData(newData);
  };

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const categoryObj = CATEGORIES.find(c => c.id === formData.category);
      const requestTitle = categoryObj ? categoryObj.title + ' Request' : 'Help Request';
      
      const payload = {
        requester_id: user.id,
        category: formData.category as RequestCategory,
        title: requestTitle,
        description: formData.description,
        priority: (formData.urgency === 'now' ? 'urgent' : 'normal') as "urgent" | "normal",
        preferred_time: null,
        address: formData.address,
        latitude: null,
        longitude: null,
        special_instructions: '',
        volunteer_id: null,
        status: 'submitted' as const
      };

      if (!import.meta.env.VITE_SUPABASE_URL) {
        addRequest(payload);
      } else {
        await RequestService.createRequest(payload);
      }
      navigate('/requester/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit request. Please try again.');
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const getSummaryText = () => {
    const cat = CATEGORIES.find(c => c.id === formData.category)?.title.toLowerCase() || 'help';
    let timeText = 'sometime today';
    if (formData.urgency === 'now') timeText = 'as soon as possible';
    if (formData.urgency === 'week') timeText = 'sometime this week';
    
    return `A neighbor will come to ${formData.address} ${timeText} for ${cat}. They will see this message: "${formData.description}"`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-4 pt-10 flex items-center gap-4 bg-transparent z-10">
        <button onClick={() => step > 1 ? handleBack() : navigate(-1)} className="p-3 -ml-3 rounded-full hover:bg-stone-200 transition-colors bg-stone-100" aria-label="Go Back">
          <ArrowLeft className="w-6 h-6 text-stone-900" />
        </button>
      </header>

      <main className="p-6 max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Progress Ripples */}
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${s === step ? 'bg-primary ring-4 ring-primary/20 scale-125' : s < step ? 'bg-primary/50' : 'bg-stone-200'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-display font-bold mb-8 tracking-tight text-foreground">What kind of help do you need?</h2>
              
              <div className="space-y-4 flex-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => { updateForm({ category: cat.id as any }); handleNext(); }}
                    className={`w-full p-5 rounded-[1.5rem] border-2 text-left flex items-center gap-5 transition-all ${formData.category === cat.id ? 'border-primary bg-primary/5 shadow-md' : 'border-stone-100 bg-white hover:border-stone-200 shadow-sm'}`}
                  >
                    <div className={`w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-stone-100 ${cat.color}`}>
                      <cat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-stone-900">{cat.title}</h3>
                      <p className="text-[17px] text-stone-500 font-medium leading-tight mt-1">{cat.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-display font-bold mb-2 tracking-tight text-foreground">Tell us a bit more</h2>
              <p className="text-[19px] text-stone-500 mb-8 font-medium">
                {isListening ? (
                  <span className="text-rose-500 animate-pulse font-bold">Listening... Speak now</span>
                ) : (
                  "Use your voice or type it out."
                )}
              </p>
              
              <div className="space-y-8 flex-1">
                <div className="relative">
                  <Textarea 
                    value={formData.description}
                    onChange={e => updateForm({ description: e.target.value })}
                    placeholder="E.g., I need someone to pick up my blood pressure medication from Medical Trust Pharmacy..."
                    className="min-h-[180px] text-xl rounded-3xl p-6 pr-16 bg-white border-2 border-stone-100 shadow-sm focus-visible:ring-4 focus-visible:ring-primary/20 resize-none leading-relaxed"
                  />
                  <button 
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`absolute right-4 bottom-4 w-14 h-14 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${isListening ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse' : 'bg-primary text-white hover:bg-primary/90'}`}
                    aria-label={isListening ? "Stop listening" : "Start voice input"}
                  >
                    <Mic className="w-6 h-6" />
                  </button>
                </div>
                {speechError && (
                  <p className="text-destructive text-sm font-semibold -mt-6">
                    {speechError}
                  </p>
                )}

                <div className="space-y-3">
                  <label className="text-[19px] font-bold text-stone-900 block">When do you need this?</label>
                  <div className="flex bg-stone-100 p-1.5 rounded-2xl">
                    {(['now', 'today', 'week'] as const).map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => updateForm({ urgency: u })}
                        className={`flex-1 py-3 rounded-xl text-[17px] font-bold transition-all ${formData.urgency === u ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                      >
                        {u === 'now' ? 'Right now' : u === 'today' ? 'Today' : 'This week'}
                      </button>
                    ))}
                  </div>
                  {formData.urgency === 'now' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[16px] font-semibold text-stone-500 bg-amber-50/50 border border-amber-100/50 p-4 rounded-2xl leading-relaxed"
                    >
                      Help Hive is for everyday assistance. For medical or safety emergencies, please call <span className="text-destructive font-black">112</span> instead.
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[19px] font-bold text-stone-900 block">Where are you?</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-6 h-6" />
                    <Input 
                      value={formData.address}
                      onChange={e => updateForm({ address: e.target.value })}
                      className="h-16 text-xl rounded-2xl pl-12 bg-white shadow-sm border border-stone-100 font-medium text-stone-700"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full h-20 text-[22px] font-bold rounded-2xl mt-10 bg-primary hover:bg-primary/90 text-white shadow-[0_8px_30px_rgba(31,58,61,0.25)] transition-transform active:scale-95" 
                onClick={handleNext}
                disabled={!formData.description}
              >
                Review
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex-1 flex flex-col"
            >
              <h2 className="text-3xl font-display font-bold mb-8 tracking-tight text-foreground">Does this look right?</h2>
              
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 mb-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-accent" />
                <p className="text-[22px] text-stone-900 leading-relaxed font-medium">
                  {getSummaryText()}
                </p>
              </div>
              
              <div className="mt-auto">
                <Button 
                  className="w-full h-20 text-[22px] font-bold rounded-2xl bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-3 shadow-[0_8px_30px_rgba(46,122,91,0.3)] transition-transform active:scale-95" 
                  onClick={handleSubmit}
                >
                  <CheckCircle2 className="w-8 h-8" />
                  Send Request
                </Button>
                <p className="text-center text-stone-500 mt-6 font-medium text-[15px]">
                  This will be shared securely with verified neighbors.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

