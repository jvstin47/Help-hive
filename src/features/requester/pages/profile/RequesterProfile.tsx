import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Moon, Bell, Shield, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { applyDarkMode, isDarkModeEnabled } from '@/utils/darkMode';
import { BottomNav } from '@/components/BottomNav';

export const RequesterProfile = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(isDarkModeEnabled());

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleDarkMode = (value: boolean) => {
    setDarkMode(value);
    applyDarkMode(value);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="px-6 pt-14 pb-6 bg-gradient-to-b from-primary/[0.07] to-transparent honeycomb-bg">
        <h1 className="text-3xl font-black tracking-tight text-foreground">My Profile</h1>
      </header>
      
      <main className="px-5 max-w-2xl mx-auto space-y-4 relative z-10 -mt-2">
        {/* Avatar Card */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-white rounded-[2rem] shadow-sm border border-stone-100 text-center p-8">
          <div className="w-24 h-24 mx-auto mb-5 rounded-full shadow-md ring-4 ring-white">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <div className="w-full h-full bg-primary text-white rounded-full flex items-center justify-center text-4xl font-black">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight">{profile?.full_name || 'Loading...'}</h2>
          <p className="text-base font-semibold text-stone-500 mt-1">{profile?.email}</p>
          {profile?.phone && (
            <p className="text-sm font-semibold text-stone-400 mt-1 flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />{profile.phone}
            </p>
          )}
        </motion.div>

        {/* Settings + Logout */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden divide-y divide-stone-100">
          <button
            onClick={() => setShowSettings(true)}
            className="w-full p-6 flex items-center gap-5 hover:bg-stone-50 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Settings className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span className="block text-lg font-black text-stone-900">Account Settings</span>
              <span className="block text-sm font-semibold text-stone-500">Notifications, dark mode, privacy</span>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-6 flex items-center gap-5 hover:bg-destructive/5 transition-colors text-left group"
          >
            <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center shrink-0">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <span className="text-lg font-black text-destructive">Sign Out</span>
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
                <div className="p-5 bg-stone-50 rounded-2xl border border-destructive/20 flex flex-col justify-between items-start gap-4">
                  <div className="w-full flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-destructive">Emergency Contacts</h3>
                      <p className="text-sm text-stone-600 mt-1">Who to alert if you use the SOS button</p>
                    </div>
                  </div>
                  <button className="text-sm font-bold text-destructive hover:underline">Manage Contacts &rarr;</button>
                </div>
                
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-black text-stone-900">Push Notifications</h3>
                      <p className="text-sm font-semibold text-stone-500 mt-0.5">Updates on your requests</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${notificationsEnabled ? 'bg-primary' : 'bg-stone-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-black text-stone-900">Dark Mode</h3>
                      <p className="text-sm font-semibold text-stone-500 mt-0.5">Easier on eyes at night</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDarkMode(!darkMode)}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-primary/20 ${darkMode ? 'bg-primary' : 'bg-stone-300'}`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 shadow-sm transition-transform duration-300 ${darkMode ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>

                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-secondary" />
                    <h3 className="font-black text-stone-900">Privacy & Safety</h3>
                  </div>
                  <p className="text-sm font-semibold text-stone-500 leading-relaxed">Your exact address is only shared with verified volunteers when they accept your request. We never share your phone number directly.</p>
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
      <BottomNav role="requester" />
    </div>
  );
};
