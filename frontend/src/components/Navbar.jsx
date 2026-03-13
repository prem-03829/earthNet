import { useAppStore } from '../store/useAppStore';

export default function Navbar({ role }) {
  const { setMobileMenuOpen } = useAppStore();

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
        <div className="size-9 rounded-full border border-primary/20 ring-2 ring-primary/5 bg-slate-300 dark:bg-slate-700 overflow-hidden">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp3fcDeYLg208bCk0ztIFblaK2xJzNeUZTKZaoF4Rhzs9-3IcYa8eeuAMq7cW26OCsYm5AZ2GmyrJPsb5Pu8T1m43GQA1XirbTDgvQnxGZUnc22i2cXFsQACOdcN0-vmGqAifS_N6JBjyf6SkeMsjrdoDSecHnIWbZTegcrTg9yxIbBcpHyNxZCAwlJpZOndgqi0McYgUc4x428LxOJjjbeRqAiXIk6_C3_70J8k1pRJ6e6hD0kMVTxWkVI3az7KqoQndy2tUkv1c" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
