import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const role = e.target.role.value;
    if (role === 'citizen') navigate('/citizen/map');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24 bg-slate-900 border-r border-slate-800/50" style={{ backgroundImage: 'radial-gradient(at 0% 0%, rgba(34, 197, 94, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(34, 197, 94, 0.1) 0px, transparent 50%)' }}>
        <div className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="size-10 bg-primary/20 flex items-center justify-center rounded-lg">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">PrithviNet</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4 text-slate-100">
            Unified environmental monitoring and civic reporting system
          </h2>
          <p className="text-slate-400 text-lg mb-12">
            Empowering citizens and authorities to monitor, report, and protect our environment through integrated data analytics.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="material-symbols-outlined text-primary mb-2">sensors</span>
              <p className="text-sm font-semibold text-slate-200">Real-time Sensors</p>
              <p className="text-xs text-slate-500">Global environmental tracking</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="material-symbols-outlined text-primary mb-2">public</span>
              <p className="text-sm font-semibold text-slate-200">Civic Action</p>
              <p className="text-xs text-slate-500">Community-driven reporting</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="material-symbols-outlined text-primary mb-2">bar_chart</span>
              <p className="text-sm font-semibold text-slate-200">Data Insights</p>
              <p className="text-xs text-slate-500">Advanced analytical tools</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
              <span className="material-symbols-outlined text-primary mb-2">verified_user</span>
              <p className="text-sm font-semibold text-slate-200">Secure Access</p>
              <p className="text-xs text-slate-500">Role-based governance</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/50">
        <div className="w-full max-w-md bg-white dark:bg-slate-800/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/40 backdrop-blur-sm shadow-xl">
          <div className="mb-8 text-center md:hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-3xl">eco</span>
              <h1 className="text-2xl font-bold">PrithviNet</h1>
            </div>
          </div>
          <div className="mb-8 text-left">
            <h3 className="text-2xl font-bold">Sign In</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Access the PrithviNet dashboard</p>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Select Role</label>
              <div className="relative">
                <select name="role" className="w-full h-12 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-lg px-4 appearance-none focus:ring-2 focus:ring-primary outline-none transition-all">
                  <option value="citizen">Citizen</option>
                  <option value="authority">Authority / Inspector</option>
                  <option value="government">Government Official</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email or ID</label>
              <div className="relative">
                <input className="w-full h-12 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-lg px-10 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="name@example.com" type="text" defaultValue="admin@prithvinet.gov" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-lg">alternate_email</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                <a className="text-xs text-primary hover:underline" href="#">Forgot password?</a>
              </div>
              <div className="relative">
                <input className="w-full h-12 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-lg px-10 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" type="password" defaultValue="password" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <span className="material-symbols-outlined text-lg">lock</span>
                </div>
              </div>
            </div>
            <button className="w-full h-12 bg-primary hover:bg-primary/90 text-background-dark font-bold rounded-lg transition-all shadow-lg shadow-primary/20" type="submit">
              Login
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700/50 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              New to the platform? 
              <button onClick={() => navigate('/register')} className="text-primary font-semibold hover:underline ml-1">Register as Citizen</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
