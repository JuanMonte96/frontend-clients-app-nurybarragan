/**
 * ToastContext — sistema global de notificaciones.
 *
 * Provee el hook useToast() con:
 *   showToast(message, type, duration)
 *     - type: 'success' | 'error' | 'warning' | 'info'
 *     - duration: ms antes de auto-cerrar (default 4000, 0 = no auto-cerrar)
 *
 * Ejemplo:
 *   const { showToast } = useToast();
 *   showToast('Perfil actualizado', 'success');
 *   showToast('Error al subir archivo', 'error');
 */

import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>');
  return ctx;
};

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

/* ─── Estilos por tipo ─────────────────────────────────────── */
const styles = {
  success: {
    bar: 'bg-green-500',
    bg: 'bg-green-50 border-green-400 text-green-800',
    icon: (
      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    bar: 'bg-red-500',
    bg: 'bg-red-50 border-red-400 text-red-800',
    icon: (
      <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    bar: 'bg-yellow-400',
    bg: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    icon: (
      <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
  },
  info: {
    bar: 'bg-blue-400',
    bg: 'bg-blue-50 border-blue-400 text-blue-800',
    icon: (
      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
      </svg>
    ),
  },
};

/* ─── Contenedor que renderiza todos los toasts activos ───── */
function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

/* ─── Item individual de toast ─────────────────────────────── */
function ToastItem({ toast, onClose }) {
  const s = styles[toast.type] ?? styles.info;

  return (
    <div
      className={`pointer-events-auto relative overflow-hidden rounded-xl border shadow-lg flex items-start gap-3 px-4 py-3 text-sm font-medium animate-[slideInRight_0.25s_ease-out] ${s.bg}`}
    >
      {/* barra lateral de color */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${s.bar}`} />

      {/* icono */}
      <span className="ml-2 mt-0.5">{s.icon}</span>

      {/* mensaje */}
      <p className="flex-1 leading-snug">{toast.message}</p>

      {/* botón cerrar */}
      <button
        onClick={() => onClose(toast.id)}
        className="text-current opacity-50 hover:opacity-100 transition-opacity ml-1 mt-0.5 flex-shrink-0"
        aria-label="Cerrar"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
