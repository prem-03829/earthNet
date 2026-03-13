import { cn } from '../utils/cn';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/20 rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-primary/10 flex items-center justify-between">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
