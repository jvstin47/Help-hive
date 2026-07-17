import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, ShieldCheck, ArrowLeft, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { applyDarkMode, isDarkModeEnabled } from '@/utils/darkMode';
import { BottomNav } from '@/components/BottomNav';
import { ProfileService } from '@/services/profile/profile.service';

export const VolunteerProfile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const [isAvailable, setIsAvailable] = useState(profile?.availability_status === 'available');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(isDarkModeEnabled());

  const handleDarkMode = (value: boolean) => {
    setDarkMode(value);
    applyDarkMode(value);
  };

  // suppress lint for darkMode since it's used in the settings sheet
  void darkMode; void handleDarkMode;

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const toggleAvailability = async () => {
    if (!profile?.id) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      try {
        await ProfileService.upsertProfile({ 
          id: profile.id, 
          availability_status: newStatus ? 'available' : 'offline' 
        });
      } catch (err) {
        console.error('Failed to update status', err);
        setIsAvailable(!newStatus); // revert on failure
      }
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <header className="px-6 py-4 pt-10 flex items-center justify-between bg-white sticky top-0 z-20 border-b border-stone-100/50 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/volunteer/dashboard')} className="p-3 -ml-3 rounded-full hover:bg-stone-100 transition-colors">
            <ArrowLeft className="w-7 h-7 text-stone-800" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">Profile</h1>
        </div>
        <button 
          onClick={toggleAvailability}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-colors border shadow-sm flex items-center gap-2 ${isAvailable ? 'bg-secondary/10 border-secondary/20 text-secondary' : 'bg-stone-100 border-stone-200 text-stone-500'}`}
        >
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-secondary animate-pulse' : 'bg-stone-400'}`} />
          {isAvailable ? 'On Call' : 'Offline'}
        </button>
      </header>
      
      <main className="p-5 max-w-2xl mx-auto space-y-6 mt-2 relative z-10">

        {/* Profile Card */}
        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
          
          <div className="relative z-10 w-[120px] h-[120px] mx-auto mt-12 mb-6 bg-white p-1.5 rounded-full shadow-md">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 text-primary rounded-full flex items-center justify-center text-5xl font-display font-bold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'V'}
              </div>
            )}
          </div>
          
          <h2 className="text-[28px] font-display font-black text-stone-900 flex items-center justify-center gap-2 tracking-tight">
            {profile?.full_name} <ShieldCheck className="w-7 h-7 text-secondary" />
          </h2>
          <p className="text-[17px] font-semibold text-stone-500 mt-2 flex items-center justify-center gap-1.5">
            <MapPin className="w-5 h-5" /> Local Community Member
          </p>

          <div className="mt-8 mb-8 flex flex-col px-6 gap-4">
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 text-left">
              <h4 className="font-bold text-stone-900 mb-4 font-display text-lg">Verified Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-display font-bold text-primary mb-1">12</div>
                  <div className="text-sm font-medium text-stone-500 leading-tight">Completed<br/>Requests</div>
                </div>
                <div>
                  <div className="text-3xl font-display font-bold text-primary mb-1">5.0</div>
                  <div className="text-sm font-medium text-stone-500 leading-tight">Average<br/>Rating</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Links */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-100 overflow-hidden">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full p-7 flex items-center gap-6 hover:bg-stone-50 transition-colors text-left border-b border-stone-100 group"
          >
            <div className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center group-hover:bg-white shadow-sm transition-colors shrink-0">
              <Settings className="w-7 h-7 text-stone-500" />
            </div>
            <div>
              <span className="block text-[20px] font-bold text-stone-900 tracking-tight">Account Settings</span>
              <span className="block text-[15px] font-medium text-stone-500 mt-1">Manage notifications and preferences</span>
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full p-7 flex items-center gap-6 hover:bg-destructive/5 transition-colors text-left group"
          >
            <div className="w-14 h-14 bg-destructive/5 rounded-full flex items-center justify-center group-hover:bg-white shadow-sm transition-colors shrink-0">
              <LogOut className="w-7 h-7 text-destructive" />
            </div>
            <span className="text-[20px] font-bold text-destructive tracking-tight">Sign Out</span>
          </button>
        </motion.div>
      </main>

      {/* Simple Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-[2.5rem] p-8 pb-12 shadow-2xl h-[70vh] flex flex-col"
            >
              <div className="w-12 h-1.5 bg-stone-200 rounded-full mx-auto mb-8" />
              <h2 className="text-2xl font-display font-bold text-stone-900 mb-6">Account Settings</h2>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900">Push Notifications</h3>
                    <p className="text-sm text-stone-500 mt-1">New requests near you</p>
                  </div>
                  <button 
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${notificationsEnabled ? 'bg-secondary' : 'bg-stone-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900">Location Sharing</h3>
                    <p className="text-sm text-stone-500 mt-1">Enable map features</p>
                  </div>
                  <button 
                    onClick={() => setLocationSharing(!locationSharing)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${locationSharing ? 'bg-secondary' : 'bg-stone-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${locationSharing ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900">Dark Mode</h3>
                    <p className="text-sm text-stone-500 mt-1">Toggle dark appearance</p>
                  </div>
                  <button 
                    onClick={() => handleDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${darkMode ? 'bg-secondary' : 'bg-stone-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <h3 className="font-bold text-stone-900 mb-2">Background Checks</h3>
                  <p className="text-sm text-stone-500">Your annual background check is valid until 2027.</p>
                </div>
              </div>
              
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 h-16 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <BottomNav role="volunteer" />
    </div>
  );
};
