import { cn } from '../utils/cn';

export default function Card({ children, className, ...props }) {
  return (
    <div className={cn("p-6 rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-primary/5", className)} {...props}>
      {children}
    </div>
  );
}
