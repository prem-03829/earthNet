import { useNavigate } from 'react-router-dom';

export default function CitizenRegister() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    navigate('/citizen/map');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-solid border-slate-200 dark:border-border-dark px-6 py-4 lg:px-20 bg-white/50 dark:bg-background-dark/50 backdrop-blur-md">
        <div className="flex items-center gap-3 text-primary">
          <span className="material-symbols-outlined text-3xl">eco</span>
          <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">PrithviNet</h2>
        </div>
        <button onClick={() => navigate('/login')} className="flex items-center justify-center rounded-lg h-10 bg-slate-200 dark:bg-neutral-dark text-slate-900 dark:text-slate-100 px-4 hover:bg-slate-300 dark:hover:bg-primary/20 transition-colors">
          <span className="material-symbols-outlined text-xl">login</span>
          <span className="ml-2 text-sm font-semibold">Sign In</span>
        </button>
      </header>

      <main className="flex-1 flex justify-center items-start py-12 px-6">
        <div className="w-full max-w-[520px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-4xl font-black tracking-tight">Citizen Registration</h1>
            <p className="text-slate-600 dark:text-primary/70 text-base font-normal">Join the PrithviNet global environmental reporting network.</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-6 bg-white dark:bg-neutral-dark/30 p-8 rounded-xl border border-slate-200 dark:border-border-dark shadow-sm">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-xl">person</span>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="John Doe" type="text" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-xl">call</span>
                  <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="+1 (555) 000-0000" type="tel" required />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">City</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-xl">location_on</span>
                  <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="San Francisco" type="text" required />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-xl">mail</span>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="name@example.com" type="email" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3.5 text-slate-400 text-xl">lock</span>
                <input className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-border-dark bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="••••••••" type="password" required />
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <div className="flex items-center h-5">
                <input className="h-5 w-5 rounded border-slate-300 dark:border-border-dark bg-white dark:bg-neutral-dark text-primary focus:ring-primary" id="policy" type="checkbox" required />
              </div>
              <label className="text-sm text-slate-600 dark:text-slate-400 leading-tight" htmlFor="policy">
                I agree to the <a className="text-primary hover:underline" href="#">Environmental Data Policy</a> and <a className="text-primary hover:underline" href="#">Terms of Service</a>.
              </label>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
              <span className="material-symbols-outlined">how_to_reg</span>
              Create Civic Account
            </button>
          </form>

          <footer className="mt-8 text-center text-slate-500 dark:text-slate-600 text-sm">
            <p>© 2024 PrithviNet Foundation. Protecting our planet through data.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
