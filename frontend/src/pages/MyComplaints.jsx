import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Timeline from '../components/Timeline';
import ComplaintCard from '../components/ComplaintCard';
import Button from '../components/Button';
import EvidenceModal from '../components/EvidenceModal';

export default function MyComplaints() {
  const navigate = useNavigate();
  const { complaints } = useAppStore();
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const latestComplaint = complaints[0] || {};
  
  const timelineEvents = [
    { title: "Inspector Dispatched", description: "Inspector Michael Chen is en route to site for air quality sampling.", time: "Oct 28, 2024 — 10:30 AM", isLatest: true, icon: "local_shipping" },
    { title: "Reviewed & Validated", description: "Case officer verified GPS coordinates and photo metadata.", time: "Oct 27, 2024 — 02:15 PM", icon: "verified" },
    { title: "Received", description: "Complaint successfully logged into the system.", time: "Oct 26, 2024 — 09:00 AM", icon: "mark_email_read" },
  ];

  const handleViewEvidence = (complaint) => {
    setSelectedComplaint(complaint);
    setIsEvidenceModalOpen(true);
  };

  const handlePastReportClick = (id) => {
    navigate(`/citizen/complaint/${id}`);
  };

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-black tracking-tight">My Complaints</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Track and manage your filed environmental reports in real-time.</p>
        </div>
        <Button 
          variant="primary" 
          className="flex items-center gap-2 whitespace-nowrap"
          onClick={() => navigate('/citizen/file-complaint')}
        >
          <span className="material-symbols-outlined">add</span>
          New Complaint
        </Button>
      </header>

      {complaints.length === 0 ? (
        <div className="text-center py-20 bg-primary/5 rounded-2xl border border-primary/10 border-dashed">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">assignment_late</span>
          <p className="text-slate-500">You haven't filed any complaints yet.</p>
          <Button 
            variant="outline" 
            className="mt-4 mx-auto"
            onClick={() => navigate('/citizen/file-complaint')}
          >
            File your first report
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden shadow-sm">
              <div className="relative h-64 bg-slate-200 dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <span className="bg-primary/20 backdrop-blur-md text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/30">
                    {latestComplaint.status}
                  </span>
                  <span className="text-white/80 text-sm font-medium">Filed {latestComplaint.date}</span>
                </div>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">Complaint #{latestComplaint.id}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">{latestComplaint.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-400 dark:text-primary/40 uppercase tracking-widest">Assigned Authority</p>
                    <p className="text-lg font-bold text-primary">{latestComplaint.authority || "Unit Delta"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-primary/5">
                    <span className="material-symbols-outlined text-primary mb-2">location_on</span>
                    <p className="text-xs text-slate-400 font-bold uppercase">Location</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{latestComplaint.location}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-primary/5">
                    <span className="material-symbols-outlined text-primary mb-2">warning</span>
                    <p className="text-xs text-slate-400 font-bold uppercase">Severity</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{latestComplaint.severity}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-background-dark/50 rounded-lg border border-slate-100 dark:border-primary/5">
                    <span className="material-symbols-outlined text-primary mb-2">category</span>
                    <p className="text-xs text-slate-400 font-bold uppercase">Type</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{latestComplaint.type}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => handleViewEvidence(latestComplaint)}
                  >
                    View Evidence Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => alert("Message feature coming soon!")}
                  >
                    Message Case Officer
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="xl:col-span-1">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-primary/10 rounded-xl p-8 sticky top-8">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Live Timeline
              </h3>
              <Timeline events={timelineEvents} />
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-primary/10">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-primary/5 rounded-lg border border-slate-200 dark:border-primary/10">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Need Help?</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Our support team is online.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="mt-12">
        <h3 className="text-xl font-bold mb-6">Past Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.slice(1).map((c, idx) => (
            <div key={idx} onClick={() => handlePastReportClick(c.id)} className="cursor-pointer">
              <ComplaintCard data={c} />
            </div>
          ))}
          <div className="p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-primary/5 rounded-xl flex flex-col justify-center items-center group cursor-pointer hover:border-primary/40 transition-all border-dashed">
            <span className="material-symbols-outlined text-slate-400 mb-1">history</span>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">View Archives</p>
          </div>
        </div>
      </section>

      <EvidenceModal 
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        files={selectedComplaint?.files}
      />
    </div>
  );
}
