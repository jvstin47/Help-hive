import type { RequestStatus } from '@/types/database.types';

export const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const getStatusConfig = (s: RequestStatus) => {
    switch (s) {
      case 'draft': return { bg: 'bg-stone-100 border border-stone-200', text: 'text-stone-700', label: 'Draft', dot: 'bg-stone-400' };
      case 'submitted': 
      case 'pending': return { bg: 'bg-blue-50 border border-blue-100', text: 'text-blue-700', label: 'Finding a volunteer', dot: 'bg-blue-500', pulse: true };
      case 'assigned': return { bg: 'bg-primary/10 border border-primary/20', text: 'text-primary', label: 'Volunteer Assigned', dot: 'bg-primary' };
      case 'traveling': return { bg: 'bg-amber-50 border border-amber-100', text: 'text-amber-700', label: 'On the way', dot: 'bg-amber-500', pulse: true };
      case 'arrived': return { bg: 'bg-orange-50 border border-orange-100', text: 'text-orange-700', label: 'Volunteer Arrived', dot: 'bg-orange-500' };
      case 'in_progress': return { bg: 'bg-secondary/10 border border-secondary/20', text: 'text-secondary', label: 'In Progress', dot: 'bg-secondary', pulse: true };
      case 'completed': return { bg: 'bg-green-100 border border-green-200', text: 'text-green-800', label: 'Completed', dot: 'bg-green-600' };
      case 'cancelled': return { bg: 'bg-red-50 border border-red-100', text: 'text-red-700', label: 'Cancelled', dot: 'bg-red-500' };
      default: return { bg: 'bg-stone-100 border border-stone-200', text: 'text-stone-800', label: s, dot: 'bg-stone-500' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${config.bg} ${config.text} shadow-sm shrink-0`}>
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`}></span>
      </span>
      {config.label}
    </span>
  );
};
