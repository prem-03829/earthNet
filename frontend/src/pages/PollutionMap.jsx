import { useRef } from 'react';
import MapUi from '../components/MapUi';
import { usePollutionStore } from '../store/usePollutionStore';
import { useUserStore } from '../store/useUserStore';
import { sensorService } from '../services/sensorService';
import { cn } from '../utils/cn';

export default function PollutionMap({ isAdmin }) {
  const { sensors, setSensors } = usePollutionStore();
  const { focusLocation, setFocusLocation, userLocation, detectLocation } = useUserStore();
  const mapRef = useRef(null);

  const handleRefresh = async () => {
    const data = await sensorService.getSensors();
    setSensors(data);
  };

  const handleRecenter = () => {
    if (userLocation) {
      const loc = { name: userLocation.city, lat: userLocation.lat, lng: userLocation.lng };
      setFocusLocation(loc);
      mapRef.current?.flyTo(loc.lat, loc.lng, 13);
    } else {
      detectLocation((loc) => {
        mapRef.current?.flyTo(loc.lat, loc.lng, 13);
      });
    }
  };

  return (
    <div className="relative flex-1 h-[calc(100vh-64px)] w-full bg-slate-200 dark:bg-slate-900 overflow-hidden animate-in fade-in duration-700">
      {sensors.length > 0 ? (
        <MapUi ref={mapRef} sensors={sensors} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary font-bold">Initializing Sensor Network...</p>
          </div>
        </div>
      )}
      
      {/* Top Filter Bar with Glassmorphism */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[400] pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/10 dark:bg-background-dark/40 p-2 shadow-2xl backdrop-blur-xl border border-white/10 dark:border-primary/20 pointer-events-auto">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-primary/5 p-1 rounded-xl">
            {['Air', 'Water', 'Noise'].map((label, idx) => (
              <button 
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
                  idx === 0 ? "bg-primary text-background-dark shadow-lg" : "text-slate-400 hover:text-primary"
                )}
              >
                <span className="material-symbols-outlined text-sm">{label.toLowerCase() === 'air' ? 'air' : label.toLowerCase() === 'water' ? 'water_drop' : 'volume_up'}</span>
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-2">
            <div className="flex flex-col items-start px-2 hidden md:flex">
              <span className="text-[10px] uppercase font-bold text-slate-400">Current Focus</span>
              <span className="text-xs font-bold text-primary truncate max-w-[120px]">{focusLocation?.name || 'India'}</span>
            </div>
            <div className="h-8 w-px bg-white/10 dark:bg-primary/20"></div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border border-white/10 dark:border-primary/30 px-3 py-2 text-sm font-medium hover:bg-white/5 dark:hover:bg-primary/10 transition-all text-slate-300"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Reload
            </button>
          </div>
        </div>
      </div>

      {/* Map Control Buttons */}
      <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-[400]">
        <button 
          onClick={() => mapRef.current?.zoomIn()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 dark:bg-background-dark/60 shadow-xl border border-white/10 dark:border-primary/20 backdrop-blur-md hover:bg-primary hover:text-background-dark transition-all text-slate-300"
          title="Zoom In"
        >
          <span className="material-symbols-outlined">add</span>
        </button>
        <button 
          onClick={() => mapRef.current?.zoomOut()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 dark:bg-background-dark/60 shadow-xl border border-white/10 dark:border-primary/20 backdrop-blur-md hover:bg-primary hover:text-background-dark transition-all text-slate-300"
          title="Zoom Out"
        >
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button 
          onClick={handleRecenter}
          className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-background-dark shadow-xl hover:scale-105 active:scale-95 transition-all"
          title="Recenter to My Location"
        >
          <span className="material-symbols-outlined">near_me</span>
        </button>
      </div>

      <div className="absolute left-6 bottom-6 z-[400]">
        <div className="rounded-2xl bg-white/10 dark:bg-background-dark/60 p-4 shadow-xl border border-white/10 dark:border-primary/20 backdrop-blur-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">Pollution Levels</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-primary"></div><span className="text-xs font-medium text-slate-300">Safe (0-50)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-yellow-500"></div><span className="text-xs font-medium text-slate-300">Moderate (51-100)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-orange-500"></div><span className="text-xs font-medium text-slate-300">Unhealthy (101-200)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-red-600"></div><span className="text-xs font-medium text-slate-300">Critical (200+)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
