import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import AdminLayout from './layouts/AdminLayout';
import CitizenLayout from './layouts/CitizenLayout';

// Pages
import Dashboard from './pages/Dashboard';
import PollutionMap from './pages/PollutionMap';
import Compliance from './pages/Compliance';
import Alerts from './pages/Alerts';
import AiAssistant from './pages/AiAssistant';
import MyComplaints from './pages/MyComplaints';
import FileComplaint from './pages/FileComplaint';
import InvestigationDetail from './pages/InvestigationDetail';
import ComplaintDetails from './pages/ComplaintDetails';
import Login from './pages/Login';
import CitizenRegister from './pages/CitizenRegister';
import DummyPage from './pages/DummyPage';

// Store & Services
import { useAppStore } from './store/useAppStore';
import { sensorService } from './services/sensorService';
import { alertService } from './services/alertService';
import { complaintService } from './services/complaintService';
import { complianceService } from './services/complianceService';

function App() {
  const { setSensors, setAlerts, setComplaints, setComplianceData, simulateRealtime } = useAppStore();

  useEffect(() => {
    Promise.all([
      sensorService.getSensors(),
      alertService.getAlerts(),
      complaintService.getComplaints(),
      complianceService.getComplianceData()
    ]).then(([sensors, alerts, complaints, compliance]) => {
      setSensors(sensors);
      setAlerts(alerts);
      setComplaints(complaints);
      setComplianceData(compliance);
    });

    const interval = setInterval(() => {
      simulateRealtime();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CitizenRegister />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="map" element={<PollutionMap isAdmin={true} />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="ai" element={<AiAssistant />} />
          <Route path="investigation/:id" element={<InvestigationDetail />} />
          <Route path="awareness" element={<DummyPage title="Awareness & Data" />} />
          <Route path="profile" element={<DummyPage title="Profile" />} />
        </Route>

        {/* Citizen Routes */}
        <Route path="/citizen" element={<CitizenLayout />}>
          <Route path="map" element={<PollutionMap />} />
          <Route path="file-complaint" element={<FileComplaint />} />
          <Route path="my-complaints" element={<MyComplaints />} />
          <Route path="complaint/:id" element={<ComplaintDetails />} />
          <Route path="awareness" element={<DummyPage title="Awareness & Data" />} />
          <Route path="profile" element={<DummyPage title="Profile" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
