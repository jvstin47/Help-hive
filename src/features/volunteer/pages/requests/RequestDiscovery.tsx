import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map as MapIcon, List, Filter, Search } from 'lucide-react';
import { VolunteerRequestCard } from '../../components/VolunteerRequestCard';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNav } from '@/components/BottomNav';
import { useRequests } from '@/contexts/RequestsContext';
import { Input } from '@/components/ui/input';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for default Leaflet markers in Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export const RequestDiscovery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  // TODO: [RequestsContext vs TanStack Query] This reads server-sourced request data (discoverable open requests list) from the Context rather than using TanStack Query queries.
  const { requests } = useRequests();
  const availableRequests = requests.filter(r => r.status === 'submitted');

  return (
    <div className="min-h-screen bg-background flex flex-col h-[100dvh]">
      <header className="px-6 py-4 pt-10 bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)] border-b border-stone-100/50 shrink-0 z-20 sticky top-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/volunteer/dashboard')} className="p-3 -ml-3 rounded-full hover:bg-stone-100 transition-colors">
              <ArrowLeft className="w-7 h-7 text-stone-800" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Discover</h1>
          </div>
          <button className="w-12 h-12 bg-stone-50 rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors text-stone-600" aria-label="Filter Requests">
            <Filter className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-stone-400" />
          <Input 
            placeholder="Search for requests, categories..." 
            className="h-14 pl-14 text-[17px] rounded-2xl bg-stone-50 border-transparent focus-visible:bg-white focus-visible:ring-primary/20 shadow-none"
          />
        </div>

        <div className="flex bg-stone-100 rounded-[1.25rem] p-1.5 max-w-sm mx-auto mb-4">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-bold text-[17px] transition-all duration-300 relative ${viewMode === 'list' ? 'text-primary' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setViewMode('list')}
          >
            {viewMode === 'list' && (
              <motion.div layoutId="viewModeTab" className="absolute inset-0 bg-white rounded-[1rem] shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <span className="relative z-10 flex items-center gap-2"><List className="w-5 h-5" /> List</span>
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[1rem] font-bold text-[17px] transition-all duration-300 relative ${viewMode === 'map' ? 'text-primary' : 'text-stone-500 hover:text-stone-700'}`}
            onClick={() => setViewMode('map')}
          >
            {viewMode === 'map' && (
              <motion.div layoutId="viewModeTab" className="absolute inset-0 bg-white rounded-[1rem] shadow-sm" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <span className="relative z-10 flex items-center gap-2"><MapIcon className="w-5 h-5" /> Map</span>
          </button>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
          <button className="whitespace-nowrap px-4 py-2 bg-stone-100 text-stone-700 font-bold text-sm rounded-full border border-stone-200">
            All Needs
          </button>
          <button className="whitespace-nowrap px-4 py-2 bg-white text-stone-600 font-medium text-sm rounded-full border border-stone-200">
            Urgent First
          </button>
          <button className="whitespace-nowrap px-4 py-2 bg-white text-stone-600 font-medium text-sm rounded-full border border-stone-200">
            Groceries
          </button>
          <button className="whitespace-nowrap px-4 py-2 bg-white text-stone-600 font-medium text-sm rounded-full border border-stone-200">
            Transport
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-5 max-w-2xl mx-auto w-full pb-32 relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {availableRequests.map(req => (
                <VolunteerRequestCard 
                  key={req.id} 
                  request={req}
                  requesterName="Community Member" 
                  onViewDetails={(id) => navigate(`/volunteer/requests/${id}`)}
                />
              ))}
              {availableRequests.length === 0 && (
                <div className="text-center p-10 bg-white rounded-[2rem] border border-stone-100 mt-8 shadow-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-stone-100/50 to-transparent pointer-events-none" />
                  <p className="text-[22px] font-display text-stone-900 font-bold mb-3 relative z-10">No one nearby needs help right now.</p>
                  <p className="text-[17px] text-stone-600 font-medium relative z-10 leading-relaxed">Thank you for checking. We'll notify you the moment someone does.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-[60vh] w-full min-h-[450px] bg-stone-100 rounded-[2rem] border border-stone-200 shadow-inner overflow-hidden relative z-10"
            >
              <MapContainer 
                center={[9.5550, 76.7885]} 
                zoom={14} 
                scrollWheelZoom={true} 
                className="w-full h-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {availableRequests.map(req => {
                  if (!req.latitude || !req.longitude) return null;
                  
                  const isUrgent = req.priority === 'urgent';
                  
                  const customIcon = L.divIcon({
                    className: 'custom-leaflet-marker',
                    html: `<div class="w-full h-full rounded-full border-[3px] border-white shadow-md flex items-center justify-center ${isUrgent ? 'bg-destructive w-10 h-10 -ml-5 -mt-5 animate-pulse' : 'bg-primary w-6 h-6 -ml-3 -mt-3'}"></div>`,
                    iconSize: [0, 0] // Handled by CSS inside html
                  });

                  return (
                    <Marker key={req.id} position={[req.latitude, req.longitude]} icon={customIcon}>
                      <Popup>
                        <div className="font-sans">
                          <h4 className="font-bold text-stone-900">{req.title}</h4>
                          <p className="text-sm text-stone-500 mb-2">{req.category}</p>
                          <button 
                            onClick={() => navigate(`/volunteer/requests/${req.id}`)}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <BottomNav role="volunteer" />
    </div>
  );
};
