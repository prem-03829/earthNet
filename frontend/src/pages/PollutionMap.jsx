import MapUi from '../components/MapUi';
import { useAppStore } from '../store/useAppStore';
import { sensorService } from '../services/sensorService';

export default function PollutionMap({ isAdmin }) {
  const { sensors, setSensors, mapFilter, setMapFilter } = useAppStore();

  const handleRefresh = async () => {
    const data = await sensorService.getSensors();
    setSensors(data);
  };

  return (
    <div className="relative flex-1 h-[calc(100vh-64px)] w-full bg-slate-200 dark:bg-slate-900 overflow-hidden animate-in fade-in duration-700">
      {sensors.length > 0 ? (
        <MapUi sensors={sensors} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary font-bold">Initializing Sensor Network...</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-[400] pointer-events-none">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/90 dark:bg-background-dark/90 p-2 shadow-2xl backdrop-blur-lg border border-slate-200 dark:border-primary/20 pointer-events-auto">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-primary/10 p-1 rounded-xl">
            {[
              { id: 'air', icon: 'air', label: 'Air' },
              { id: 'water', icon: 'water_drop', label: 'Water' },
              { id: 'noise', icon: 'volume_up', label: 'Noise' }
            ].map(f => (
              <button 
                key={f.id}
                onClick={() => setMapFilter(f.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  mapFilter === f.id ? "bg-primary text-background-dark shadow-md" : "text-slate-500 hover:text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-2">
            <select className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none">
              <option>Real-time (Live)</option>
              <option>Last 24 Hours</option>
            </select>
            <div className="h-8 w-px bg-slate-200 dark:bg-primary/20"></div>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-primary/30 px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-primary/10 transition-all"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Reload
            </button>
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-6 flex flex-col gap-2 z-[400]">
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 dark:bg-background-dark/90 shadow-xl border border-slate-200 dark:border-primary/20 hover:bg-primary hover:text-background-dark transition-all">
          <span className="material-symbols-outlined">add</span>
        </button>
        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 dark:bg-background-dark/90 shadow-xl border border-slate-200 dark:border-primary/20 hover:bg-primary hover:text-background-dark transition-all">
          <span className="material-symbols-outlined">remove</span>
        </button>
        <button className="mt-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-background-dark shadow-xl hover:scale-105 transition-all">
          <span className="material-symbols-outlined">near_me</span>
        </button>
      </div>

      <div className="absolute left-6 bottom-6 z-[400]">
        <div className="rounded-2xl bg-white/90 dark:bg-background-dark/90 p-4 shadow-xl border border-slate-200 dark:border-primary/20 backdrop-blur-md">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary/60">Pollution Levels ({mapFilter.toUpperCase()})</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-primary"></div><span className="text-xs font-medium opacity-80">Safe (0-50)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-yellow-500"></div><span className="text-xs font-medium opacity-80">Moderate (51-100)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-orange-500"></div><span className="text-xs font-medium opacity-80">Unhealthy (101-200)</span></div>
            <div className="flex items-center gap-3"><div className="h-3 w-3 rounded-full bg-red-600"></div><span className="text-xs font-medium opacity-80">Critical (200+)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
