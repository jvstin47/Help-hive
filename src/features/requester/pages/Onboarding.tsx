import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

const SLIDES = [
  {
    title: "Welcome to Help Hive",
    description: "Your trusted neighborhood support network. We connect you with friendly, verified local volunteers ready to lend a hand.",
    icon: HeartHandshake
  },
  {
    title: "Safety First",
    description: "Every volunteer is background-checked and verified by our community team. Your safety and peace of mind is our top priority.",
    icon: ShieldCheck
  },
  {
    title: "Easy to Request",
    description: "Need groceries? Medication? Or just a friendly chat? Requesting help takes less than 30 seconds. We'll handle the rest.",
    icon: MapPin
  }
];

export const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      localStorage.setItem('has_seen_onboarding', 'true');
      navigate('/requester/dashboard');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('has_seen_onboarding', 'true');
    navigate('/requester/dashboard');
  };

  const SlideIcon = SLIDES[currentSlide].icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center">
        <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8">
          <SlideIcon className="w-16 h-16 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {SLIDES[currentSlide].title}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          {SLIDES[currentSlide].description}
        </p>
      </div>

      <div className="w-full max-w-md pb-8">
        <div className="flex justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <div 
              key={i} 
              className={`h-2.5 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-primary' : 'w-2.5 bg-stone-200'}`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Button onClick={handleNext} className="h-16 text-xl rounded-xl">
            {currentSlide === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Button>
          <Button variant="ghost" onClick={handleSkip} className="h-14 text-lg text-muted-foreground">
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
};
