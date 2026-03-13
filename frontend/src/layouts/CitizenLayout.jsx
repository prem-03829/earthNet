import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function CitizenLayout() {
  const navLinks = [
    { label: 'Public Pollution Map', icon: 'map', to: '/citizen/map' },
    { label: 'File Complaint', icon: 'chat_bubble', to: '/citizen/file-complaint' },
    { label: 'My Complaints', icon: 'fact_check', to: '/citizen/my-complaints' },
    { label: 'AI Assistant', icon: 'robot_2', to: '/citizen/ai-assistant' },
    { label: 'Awareness & Data', icon: 'auto_stories', to: '/citizen/awareness' },
    { label: 'Profile', icon: 'account_circle', to: '/citizen/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <Sidebar 
        title="Citizen Portal" 
        links={navLinks} 
        logo="eco" 
        fixed
      />
      <main className="flex-1 ml-64 flex flex-col min-w-0 overflow-y-auto relative">
        <Navbar role="Citizen" />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
