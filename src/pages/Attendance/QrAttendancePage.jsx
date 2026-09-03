import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { scanQrAttendance } from "../../services/attendanceService";
import { getErrorMessage } from "../../utils/errorMessages";

export default function QrAttendancePage() {
  const { scheduleId } = useParams();
  const { profile, authLoading } = useAuth();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({ type: "info", message: "Procesando escaneo..." });

  const redirectTo = `/attendance/scan/${scheduleId}`;

  useEffect(() => {
    const submitAttendance = async () => {
      if (!profile?.user?.id_user || !scheduleId) return;

      setLoading(true);
      try {
        await scanQrAttendance(scheduleId, "attended");
        setResult({
          type: "success",
          message: "Asistencia registrada correctamente. Ya puedes regresar a la aplicacion.",
        });
      } catch (error) {
        setResult({
          type: "error",
          message: getErrorMessage(error),
        });
      } finally {
        setLoading(false);
      }
    };

    submitAttendance();
  }, [profile?.user?.id_user, scheduleId]);

  if (authLoading) {
    return <LoadingSpinner fullscreen message="Validando sesion..." />;
  }

  if (!profile) {
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return (
    <section className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-xl border border-[var(--color-primary)] bg-[var(--color-bg-secondary)] p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Registro de asistencia</h1>
        <p className="mt-2 text-sm text-[var(--color-text)]">Escaneo de codigo QR para registrar asistencia.</p>

        <div className="mt-6 rounded-lg border border-[var(--color-primary)] bg-[var(--color-bg)] p-4">
          {loading ? (
            <LoadingSpinner message="Registrando asistencia..." />
          ) : result.type === "success" ? (
            <p className="text-sm font-semibold text-green-700">{result.message}</p>
          ) : (
            <p className="text-sm font-semibold text-red-700">{result.message}</p>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/user/enrollments"
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-text)]"
          >
            Ir a mis inscripciones
          </Link>
          <Link
            to="/"
            className="rounded-md border border-[var(--color-primary)] px-4 py-2 text-sm"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
