import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface BottomNavProps {
  role: 'requester' | 'volunteer';
}

export const BottomNav = ({ role }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const requesterItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/requester/dashboard' },
    { icon: ClipboardList, label: 'My Requests', path: '/requester/requests-list' },
    { icon: MessageCircle, label: 'Messages', path: '/requester/messages' },
    { icon: User, label: 'Profile', path: '/requester/profile' },
  ];

  const volunteerItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/volunteer/dashboard' },
    { icon: ClipboardList, label: 'Discover', path: '/volunteer/requests' },
    { icon: MessageCircle, label: 'Messages', path: '/volunteer/messages' },
    { icon: User, label: 'Profile', path: '/volunteer/profile' },
  ];

  const items = role === 'requester' ? requesterItems : volunteerItems;
  const activeColor = role === 'requester' ? 'text-primary' : 'text-secondary';
  const activeBg = role === 'requester' ? 'bg-primary/10' : 'bg-secondary/10';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-stone-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-lg mx-auto px-2 py-2 pb-safe">
        {items.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 py-2 px-4 min-w-[64px] relative group"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId={`nav-pill-${role}`}
                  className={`absolute inset-0 ${activeBg} rounded-2xl`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon
                className={`w-6 h-6 relative z-10 transition-colors ${isActive ? activeColor : 'text-stone-400 group-hover:text-stone-600'}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[11px] font-bold relative z-10 transition-colors leading-tight ${isActive ? activeColor : 'text-stone-400 group-hover:text-stone-600'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
