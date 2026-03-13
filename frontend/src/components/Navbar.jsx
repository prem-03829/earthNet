import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export default function Navbar({ role }) {
  const { setMobileMenuOpen, user, logout } = useAppStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isCitizen = user?.role === 'citizen' || role === 'Citizen';
  const basePath = isCitizen ? '/citizen' : '/admin';

  const menuItems = isCitizen ? [
    { label: 'My Profile', to: `${basePath}/profile`, icon: 'account_circle' },
    { label: 'My Complaints', to: `${basePath}/my-complaints`, icon: 'fact_check' },
    { label: 'Notifications', to: `${basePath}/notifications`, icon: 'notifications' },
    { label: 'Settings', to: `${basePath}/settings`, icon: 'settings' },
  ] : [
    { label: 'View Profile', to: `${basePath}/profile`, icon: 'account_circle' },
    { label: 'Settings', to: `${basePath}/settings`, icon: 'settings' },
    { label: 'Notifications', to: `${basePath}/notifications`, icon: 'notifications' },
  ];

  return (
    <header className="h-16 flex-shrink-0 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between px-4 lg:px-8 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 lg:hidden text-slate-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-xl font-bold hidden sm:block">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        {role && (
          <div className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full uppercase tracking-wider border border-primary/30 hidden sm:block">
            {role}
          </div>
        )}
        <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-background-dark"></span>
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="size-9 rounded-full border border-primary/20 ring-2 ring-primary/5 bg-slate-300 dark:bg-slate-700 overflow-hidden focus:outline-none focus:ring-primary/40 transition-all"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary text-background-dark font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* User Info Section */}
              <div className="p-4 border-b border-slate-100 dark:border-primary/10 flex items-center gap-3">
                <div className="size-10 rounded-full border border-primary/20 overflow-hidden shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-background-dark font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-primary/60 font-medium truncate uppercase tracking-tight">{user?.role || role}</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item, idx) => (
                  <Link 
                    key={idx}
                    to={item.to} 
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Logout Section */}
              <div className="p-2 border-t border-slate-100 dark:border-primary/10">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
