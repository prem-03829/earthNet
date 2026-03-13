import { useState } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import { useAppStore } from '../store/useAppStore';
import { complianceService } from '../services/complianceService';

export default function Compliance() {
  const { complianceData } = useAppStore();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [violationHistory, setViolationHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleIndustryClick = async (industry) => {
    setSelectedIndustry(industry);
    setLoading(true);
    const history = await complianceService.getViolationHistory(industry.name);
    setViolationHistory(history);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-1">Industry Compliance Overview</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time monitoring of regulatory status across sectors.</p>
      </div>

      <div className="flex gap-8 border-b border-slate-200 dark:border-primary/10 mb-6">
        <button className="pb-3 border-b-2 border-primary text-primary text-sm font-semibold">All Industries</button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors">High Risk</button>
        <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-medium transition-colors">Pending Review</button>
      </div>

      <div className="flex flex-col gap-3">
        {complianceData.map((ind, idx) => (
          <div 
            key={idx} 
            onClick={() => handleIndustryClick(ind)}
            className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">{ind.icon}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{ind.name}</h4>
                  <div className={`w-2 h-2 rounded-full ${ind.status}`}></div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Last Inspection: {ind.lastInsp}</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end gap-1">
                <div className="flex justify-between w-32 items-center mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Risk Level</span>
                  <span className={`text-[10px] font-bold ${ind.textRisk}`}>{ind.risk}%</span>
                </div>
                <div className="w-32 h-1.5 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className={`h-full ${ind.riskColor}`} style={{ width: `${ind.risk}%` }}></div>
                </div>
              </div>
              <button className="p-1 rounded text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedIndustry} 
        onClose={() => setSelectedIndustry(null)}
        title={`${selectedIndustry?.name} Violation History`}
      >
        <div className="space-y-4">
          {loading ? (
            <div className="py-10 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-2 text-sm text-slate-500">Retrieving records...</p>
            </div>
          ) : (
            violationHistory.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-primary/5 rounded-lg border border-slate-100 dark:border-primary/10">
                <div>
                  <p className="text-xs font-bold text-slate-400">{v.date}</p>
                  <p className="text-sm font-semibold">{v.type}</p>
                </div>
                <Badge variant={v.status === 'Resolved' ? 'success' : 'warning'}>{v.status}</Badge>
              </div>
            ))
          )}
          {!loading && violationHistory.length === 0 && (
            <p className="text-center text-slate-500 py-4">No violations on record.</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
