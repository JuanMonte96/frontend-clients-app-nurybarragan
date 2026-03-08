/**
 * LoadingSpinner — spinner consistente en toda la app.
 *
 * Props:
 *  - fullscreen (bool)  : cubre toda la pantalla con un overlay semitransparente
 *  - message   (string) : texto opcional debajo del spinner
 *  - size      ('sm'|'md'|'lg') : tamaño del spinner (default 'md')
 *
 * Uso inline  → <LoadingSpinner message="Cargando clases..." />
 * Uso fullscreen → <LoadingSpinner fullscreen message="Iniciando sesión..." />
 */

const sizes = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-[3px]',
  lg: 'h-16 w-16 border-4',
};

export default function LoadingSpinner({ fullscreen = false, message = '', size = 'md' }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-[var(--color-primary)] border-t-transparent ${sizes[size]}`}
      />
      {message && (
        <p className="text-sm sm:text-base text-[var(--color-text)] font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--color-bg)]/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-12">
      {spinner}
    </div>
  );
}
