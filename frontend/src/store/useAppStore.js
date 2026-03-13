import { create } from 'zustand';

export const useAppStore = create((set, get) => ({
  // UI State
  sidebarOpen: true,
  mobileMenuOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  // Data State
  sensors: [],
  alerts: [],
  complaints: [],
  investigations: [],
  complianceData: [],
  
  // Filters
  mapFilter: 'air',
  setMapFilter: (filter) => set({ mapFilter: filter }),

  // Actions
  setSensors: (sensors) => set({ sensors }),
  setAlerts: (alerts) => set({ alerts }),
  setComplaints: (complaints) => set({ complaints }),
  setInvestigations: (investigations) => set({ investigations }),
  setComplianceData: (complianceData) => set({ complianceData }),

  addComplaint: (complaint) => set((state) => ({ 
    complaints: [{ ...complaint, id: `CN-${Date.now()}`, date: 'Just now' }, ...state.complaints] 
  })),

  updateAlertStatus: (alertId, status) => set((state) => ({
    alerts: state.alerts.map(a => a.id === alertId ? { ...a, type: status } : a)
  })),

  updateInvestigationStatus: (id, status) => set((state) => ({
    investigations: state.investigations.map(inv => inv.id === id ? { ...inv, status } : inv)
  })),

  // Real-time updates simulation
  simulateRealtime: () => {
    const { sensors } = get();
    if (sensors.length === 0) return;

    const updatedSensors = sensors.map(s => {
      const change = Math.floor(Math.random() * 5) - 2;
      const newAqi = Math.max(0, s.aqi + change);
      return {
        ...s,
        aqi: newAqi,
        status: newAqi > 300 ? 'critical' : newAqi > 150 ? 'unhealthy' : newAqi > 50 ? 'moderate' : 'good',
        trend: change
      };
    });
    set({ sensors: updatedSensors });
  }
}));
