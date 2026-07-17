import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Users, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SLIDES = [
  {
    icon: Users,
    title: "Connect with verified neighbors",
    desc: "Help Hive is a network of local volunteers in Kanjirappally, here to assist with your daily needs.",
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    icon: ShieldCheck,
    title: "ID-checked helpers",
    desc: "Every volunteer goes through a background check before they can accept requests.",
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  {
    icon: HeartHandshake,
    title: "Always in control",
    desc: "You choose what help you need and when. Your contact info is only shared when you accept a helper.",
    color: "text-accent",
    bg: "bg-accent/10"
  }
];

export const RequesterOnboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      navigate('/requester/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/requester/dashboard');
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end p-6">
        <button onClick={handleSkip} className="text-stone-500 font-bold hover:text-stone-900 transition-colors">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full p-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className={`w-32 h-32 rounded-full ${slide.bg} flex items-center justify-center mb-8`}>
              <slide.icon className={`w-16 h-16 ${slide.color}`} />
            </div>
            <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">{slide.title}</h2>
            <p className="text-xl text-stone-500 font-medium leading-relaxed">{slide.desc}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">
        <div className="flex justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-stone-300'}`}
            />
          ))}
        </div>
        
        <Button 
          onClick={handleNext}
          className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-md transition-transform active:scale-95"
        >
          {currentSlide === SLIDES.length - 1 ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};
