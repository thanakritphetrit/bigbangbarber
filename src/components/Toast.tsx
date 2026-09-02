import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm animate-in slide-in-from-top-4 fade-in">
      <div className={`p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs ${
        type === 'success'
          ? 'bg-stone-900 border-emerald-500/50 text-emerald-300'
          : type === 'error'
          ? 'bg-stone-900 border-rose-500/50 text-rose-300'
          : 'bg-stone-900 border-amber-500/50 text-amber-300'
      }`}>
        <div className="flex items-center gap-2">
          {type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
          {type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {type === 'info' && <Info className="w-4 h-4 text-amber-400 shrink-0" />}
          <span className="font-medium text-stone-100">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-200 cursor-pointer p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
