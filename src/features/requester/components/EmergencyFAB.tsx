import { useState } from 'react';
import { Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export const EmergencyFAB = () => {
  const [open, setOpen] = useState(false);

  const handleEmergency = () => {
    // In future, this hits a backend broadcast or calls emergency services
    console.log("Emergency Triggered!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
          className="fixed bottom-6 right-6 w-[72px] h-[72px] bg-destructive rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(193,68,61,0.4)] hover:bg-destructive/90 active:scale-95 transition-all animate-pulse-slow focus:outline-none focus:ring-4 focus:ring-destructive/30 z-50 border-[3px] border-white"
          aria-label="Emergency Button"
        >
          <Phone className="w-8 h-8 text-white" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center p-8 rounded-[2rem] border-stone-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-display text-destructive font-bold text-center">Are you safe?</DialogTitle>
          <DialogDescription className="text-[19px] text-stone-700 text-center mt-4 leading-relaxed font-medium">
            This alerts your emergency contact and nearby verified volunteers immediately — Call now?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-col gap-4 mt-8">
          <Button 
            onClick={handleEmergency} 
            className="w-full h-16 text-[19px] font-bold bg-destructive hover:bg-destructive/90 text-white rounded-2xl shadow-[0_4px_20px_rgba(193,68,61,0.3)] transition-transform active:scale-95"
          >
            Call now
          </Button>
          <Button 
            onClick={() => setOpen(false)} 
            variant="outline" 
            className="w-full h-16 text-[19px] rounded-2xl border-2 border-stone-200 text-stone-700 font-bold hover:bg-stone-50 transition-transform active:scale-95"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
