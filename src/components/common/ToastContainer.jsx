import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        const isDanger = toast.type === 'danger';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg shadow-2xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${
              isDanger
                ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-950/40'
                : isSuccess
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-950/40'
                : isWarning
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/40'
                : 'bg-command-900/90 border-cyan-500/40 text-cyan-100 shadow-cyan-950/30'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isDanger && <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isDanger && !isSuccess && !isWarning && <Info className="w-5 h-5 text-cyan-400" />}
            </div>

            <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
              {toast.message}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
