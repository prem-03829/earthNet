import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout() {
  const navLinks = [
    { label: 'Overview', icon: 'dashboard', to: '/admin/dashboard' },
    { label: 'Pollution Map', icon: 'map', to: '/admin/map' },
    { label: 'Compliance', icon: 'verified_user', to: '/admin/compliance' },
    { label: 'Policy Insights', icon: 'lightbulb', to: '#' },
    { label: 'Alerts', icon: 'notifications', to: '/admin/alerts' },
    { label: 'AI Assistant', icon: 'robot_2', to: '/assistant' },
    { label: 'Reports', icon: 'bar_chart', to: '#' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <Sidebar 
        title="Admin Console" 
        links={navLinks} 
        logo="eco" 
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <Navbar role="Official" />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
