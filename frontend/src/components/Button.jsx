import { cn } from '../utils/cn';

export default function Button({ children, className, variant = 'primary', ...props }) {
  const baseStyle = "flex items-center justify-center gap-2 rounded-lg font-bold transition-all disabled:opacity-50";
  const variants = {
    primary: "bg-primary text-background-dark hover:bg-primary/90 py-2.5 px-6 shadow-lg shadow-primary/20",
    secondary: "bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary hover:bg-slate-200 dark:hover:bg-primary/20 py-2.5 px-6",
    outline: "border-2 border-slate-200 dark:border-primary/20 text-slate-600 dark:text-slate-400 hover:border-primary py-2.5 px-6",
    ghost: "bg-transparent hover:bg-primary/10 text-slate-600 dark:text-slate-300 p-2"
  };

  return (
    <button className={cn(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
