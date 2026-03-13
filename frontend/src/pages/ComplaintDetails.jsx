import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Timeline from '../components/Timeline';
import { cn } from '../utils/cn';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { complaints } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      const found = complaints.find(c => c.id === id) || {
        id,
        title: "Waste Dumping at Sector 10",
        status: "Resolved",
        date: "2 months ago",
        location: "Sector 10, North Industrial Link",
        severity: "Medium",
        type: "Waste Mismanagement",
        description: "Large volumes of industrial waste were found dumped near the river bed. This has been a recurring issue in this sector for the past few weeks.",
        authority: "Municipal Corp.",
        remarks: "Site visited by inspector on Oct 12. Cleanup ordered and completed by Oct 15. Source traced to nearby small-scale unit.",
        resolution: "Area cleaned. Warning issued to local units. Regular patrolling added to this sector's schedule.",
        files: [
          { name: 'dump_site_1.jpg', type: 'image/jpeg' },
          { name: 'cleanup_report.pdf', type: 'application/pdf' }
        ]
      };
      setComplaint(found);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id, complaints]);

  if (loading) {
    return (
      <div className="p-8 lg:p-12 animate-pulse space-y-8">
        <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const timelineEvents = [
    { title: "Resolved", description: "Case closed after final site verification.", time: "Oct 15, 2024", icon: "task_alt" },
    { title: "Cleanup Action", description: "Sanitation crew dispatched for site clearance.", time: "Oct 13, 2024", icon: "cleaning_services" },
    { title: "Inspection", description: "Physical site inspection carried out by Inspector Sahil.", time: "Oct 12, 2024", icon: "search" },
    { title: "Received", description: "Complaint successfully logged.", time: "Oct 10, 2024", icon: "mark_email_read" },
  ];

  return (
    <div className="p-8 lg:p-12 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 group"
      >
        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
        <span className="text-sm font-semibold">Back to Complaints</span>
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={complaint.status === 'Resolved' ? 'success' : 'warning'}>{complaint.status}</Badge>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {complaint.id}</span>
          </div>
          <h2 className="text-3xl font-black tracking-tight">{complaint.title}</h2>
          <p className="text-slate-500 mt-1">Filed {complaint.date} • {complaint.location}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-sm">Download Receipt</Button>
          <Button variant="primary" className="text-sm">Re-open Case</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-200 dark:border-primary/10 pb-4">Report Description</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{complaint.description}</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-primary/10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pollution Type</p>
                <p className="text-sm font-semibold">{complaint.type}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Severity</p>
                <p className="text-sm font-semibold">{complaint.severity}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Authority</p>
                <p className="text-sm font-semibold">{complaint.authority}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="text-lg font-bold border-b border-slate-200 dark:border-primary/10 pb-4">Action Summary</h3>
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10 space-y-4">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Authority Remarks</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{complaint.remarks}"</p>
              </div>
              <div className="pt-4 border-t border-primary/10">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Final Resolution</p>
                <p className="text-sm font-medium">{complaint.resolution}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <h3 className="text-lg font-bold">Evidence Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-300 dark:border-primary/20 cursor-pointer hover:opacity-80 transition-opacity">
                  <img src={`https://picsum.photos/seed/${i + 100}/300/300`} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Tracking Timeline
            </h3>
            <Timeline events={timelineEvents} />
          </Card>

          <Card className="space-y-4 overflow-hidden">
            <h3 className="text-lg font-bold">Incident Location</h3>
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-300 dark:border-primary/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-4xl">location_on</span>
              </div>
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ugucbQ-2W9dTbDz1EY7X3nmMSiJi3hxFVfXqEjEyesBTbLvlCkkBs7ffgJGxc-TRUUTR3UiHMSgmD1ZNBdLgdvO0VjUszqRTcxvzhe89k3OzEwhHT_bXrN0kAxFjkXvYGieETaHu_N1shRquTTv8LNa_litSJnf6jPN93t97t66ZcVExEOnoYq2U5BgrHUhJzIQU44H0BcWGBCVRVS564OlcXunMNLGIVf4S_sRZrKEo3EA5ADJSWPITN2WwKWL5zU4rl-Z291Q" className="w-full h-full object-cover opacity-40 grayscale" alt="Map" />
            </div>
            <p className="text-xs text-slate-500">{complaint.location}</p>
          </Card>

          <Card className="bg-background-dark/50 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Risk Snapshot</h3>
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full border-4 border-primary flex items-center justify-center text-xs font-black">
                42
              </div>
              <div>
                <p className="text-sm font-bold text-primary">AQI: Good</p>
                <p className="text-[10px] text-slate-500">at the time of reporting</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
