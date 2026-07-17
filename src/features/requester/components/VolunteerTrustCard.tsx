import type { Profile } from '@/types/database.types';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck,Quote } from 'lucide-react';

export const VolunteerTrustCard = ({ volunteer }: { volunteer: Profile }) => {
  return (
    <Card className="bg-stone-50 border-stone-200 overflow-hidden shadow-sm">
      <CardContent className="p-7">
        <div className="flex items-start gap-6">
          <div className="relative">
            <img 
              src={volunteer.avatar_url || 'https://via.placeholder.com/150'} 
              alt={volunteer.full_name} 
              className="w-[88px] h-[88px] rounded-full object-cover border-4 border-white shadow-sm"
            />
            {volunteer.verified && (
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-secondary" aria-label="Verified Volunteer" />
              </div>
            )}
          </div>
          <div className="flex-1 pt-1">
            <h3 className="text-[22px] font-display font-bold text-stone-900 tracking-tight">
              {volunteer.full_name}
            </h3>
            <div className="mt-2 text-stone-600 font-medium text-[15px] leading-tight">
              Helped {volunteer.completed_tasks} times<br/>in your neighborhood.
            </div>
          </div>
        </div>
        {volunteer.bio && (
          <div className="mt-6 p-5 bg-white rounded-[1.5rem] text-[17px] text-stone-700 font-medium leading-relaxed border border-stone-100 shadow-sm relative">
            <Quote className="absolute -top-3 left-5 w-8 h-8 text-primary/10 fill-primary/10 bg-white px-1" />
            {volunteer.bio}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
