import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function CitizenLayout() {
  const navLinks = [
    { label: 'Public Pollution Map', icon: 'map', to: '/citizen/map' },
    { label: 'File Complaint', icon: 'chat_bubble', to: '/citizen/file-complaint' },
    { label: 'My Complaints', icon: 'fact_check', to: '/citizen/my-complaints' },
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
      <main className="flex-1 ml-64 flex flex-col">
        <header className="h-16 border-b border-slate-200 dark:border-primary/20 flex items-center justify-end px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/30 uppercase tracking-tighter">Citizen</span>
            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden bg-slate-300 dark:bg-slate-700">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcSooiWL5QJfcdvtCF5pXx7Rc-7f2WYGLJI7HXEAicDBhcfQLs1ulmlkuNyIIC4dhW4vuYUyHtnlGta_twTWhWzzvHbryg_kpmQVU94RYrrBAV6sZjdjR-UrYr6wPxo70oxs0OAVUywhYqYNwvWiUP9R54mpGwNOzTQ6MQeLZwfPV0YaPpdambOaQKYOOQLHRFZQ4A8CNw9tNOsD6eyD-OxTR9RnqXWdVqZHv8wphYU7e8WRnD2Htr4NoPLifdjBUGJq0s2U9nohw" 
                className="w-full h-full object-cover"
                alt="Profile"
              />
            </div>
          </div>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
