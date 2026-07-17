import { useState, useEffect } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

interface SafetyBannerProps {
  onAllChecked?: (checked: boolean) => void;
}

export const SafetyBanner = ({ onAllChecked }: SafetyBannerProps) => {
  const [checks, setChecks] = useState([false, false]);

  useEffect(() => {
    if (onAllChecked) {
      onAllChecked(checks.every(c => c));
    }
  }, [checks, onAllChecked]);

  const toggleCheck = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-[1.5rem] p-5 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <ShieldCheck className="w-6 h-6 text-accent" />
        <h4 className="font-display font-bold text-stone-900 text-lg">Before you accept</h4>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={() => toggleCheck(0)}
          className="w-full flex items-center gap-4 p-3 bg-white border border-stone-100 rounded-xl text-left active:scale-[0.98] transition-transform"
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checks[0] ? 'bg-accent border-accent text-white' : 'border-stone-300'}`}>
            {checks[0] && <Check className="w-4 h-4 stroke-[3px]" />}
          </div>
          <span className={`text-[16px] font-medium transition-colors ${checks[0] ? 'text-stone-900' : 'text-stone-600'}`}>
            I've reviewed the address
          </span>
        </button>
        
        <button 
          onClick={() => toggleCheck(1)}
          className="w-full flex items-center gap-4 p-3 bg-white border border-stone-100 rounded-xl text-left active:scale-[0.98] transition-transform"
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checks[1] ? 'bg-accent border-accent text-white' : 'border-stone-300'}`}>
            {checks[1] && <Check className="w-4 h-4 stroke-[3px]" />}
          </div>
          <span className={`text-[16px] font-medium transition-colors ${checks[1] ? 'text-stone-900' : 'text-stone-600'}`}>
            I'll message on arrival
          </span>
        </button>
      </div>
    </div>
  );
};
