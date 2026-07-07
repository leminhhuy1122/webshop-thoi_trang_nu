import { useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useStore, Toast as ToastType } from '../../store/useStore';

function Toast({ toast }: { key?: string | number, toast: ToastType }) {
  const { removeToast } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  return (
    <div className="flex items-center gap-3 bg-white border border-black/10 shadow-lg shadow-black/5 p-4 rounded-xl min-w-[300px] animate-in slide-in-from-right-8 fade-in duration-300">
      {icons[toast.type]}
      <p className="text-xs font-bold flex-1">{toast.message}</p>
      <button 
        onClick={() => removeToast(toast.id)}
        className="text-black/40 hover:text-black transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
