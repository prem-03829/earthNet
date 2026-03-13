import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import AlertCard from '../components/AlertCard';
import Button from '../components/Button';
import { alertService } from '../services/alertService';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, updateAlertStatus } = useAppStore();

  const handleResolve = async (id) => {
    const res = await alertService.resolveAlert(id);
    if (res.success) {
      updateAlertStatus(id, 'STABLE');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">System Alerts</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time environmental risk detection</p>
        </div>
        <Button variant="outline" className="text-sm px-4 py-2">
          <span className="material-symbols-outlined text-sm">filter_list</span>
          Filter
        </Button>
      </div>

      <div className="space-y-6">
        {alerts.length === 0 ? (
          <div className="text-center py-20 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">notifications_off</span>
            <p className="text-slate-500">No active alerts at this time.</p>
          </div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="relative group">
              <div 
                onClick={() => navigate(`/admin/investigation/${alert.id}`)}
                className="cursor-pointer"
              >
                <AlertCard title={alert.title} type={alert.type} desc={alert.desc} />
              </div>
              
              {alert.type !== 'STABLE' && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    variant="primary" 
                    className="h-8 px-3 text-[10px] uppercase"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResolve(alert.id);
                    }}
                  >
                    Resolve
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
