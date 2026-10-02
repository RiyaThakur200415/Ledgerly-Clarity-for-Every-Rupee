import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-[#F7F5F0] dark:bg-[#1E231E] border-[#2D6A4F]/20 text-[#171717] dark:text-[#F4F1EA]'
                : toast.type === 'error'
                ? 'bg-[#F7F5F0] dark:bg-[#1E231E] border-[#9E2A2B]/20 text-[#171717] dark:text-[#F4F1EA]'
                : 'bg-[#F7F5F0] dark:bg-[#1E231E] border-[#173F35]/20 text-[#171717] dark:text-[#F4F1EA]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#9E2A2B] shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-[#173F35] dark:text-[#B89B5E] shrink-0 mt-0.5" />}

            <p className="text-xs font-medium leading-relaxed flex-1">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#6B6B6B] hover:text-[#171717] dark:hover:text-[#F4F1EA] transition-colors p-0.5 -mr-1 -mt-1"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
