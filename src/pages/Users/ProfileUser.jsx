import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useClasses } from "../../context/ClassesContext";
import { ClassesRemainingCard } from "../../components/ClassesRemainingCard";

export const ProfileUser = () => {
  const { profile } = useAuth();
  const { fetchClassesRemaining } = useClasses();

  useEffect(() => {
    fetchClassesRemaining();
  }, [fetchClassesRemaining]);

  const user = profile?.user;
  const subscriptions = profile?.subscriptionByUser || [];

  return (
    <section className="space-y-4 sm:space-y-6 w-full max-w-6xl mx-auto px-0">
      <div className="bg-[var(--color-bg-secondary)] rounded-lg sm:rounded-2xl p-4 sm:p-6 shadow-md border border-[var(--color-primary)]">
        {/* Perfil del usuario */}
        <div className="flex flex-col md:flex-row items-start md:items-start md:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                {user?.name_user?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] truncate">{user?.name_user}</h2>
                <p className="text-xs sm:text-sm text-[var(--color-text)] truncate">{user?.email_user}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[var(--color-text)] mb-2">
              <span className="font-semibold">Rol:</span> {user?.role}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text)]">
              <span className="font-semibold">Certificado médico:</span>{" "}
              {user?.medical_certificated || "No registrado"}
            </p>
          </div>

          {/* Estado bloqueado */}
          <div className="w-full sm:w-auto">
            <span
              className={`inline-block px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold ${user?.is_blocked
                ? "bg-red-200 text-red-700"
                : "bg-green-200 text-green-700"
                }`}
            >
              {user?.is_blocked ? "Cuenta bloqueada" : "Cuenta activa"}
            </span>
            <div className="pt-3 sm:pt-10">
              <ClassesRemainingCard />
            </div>
          </div>
        </div>

        <hr className="border-[var(--color-primary)] my-4 sm:my-6" />

        {/* Historial de suscripciones */}
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">
          Historial de suscripciones
        </h3>

        {subscriptions.length === 0 ? (
          <p className="text-xs sm:text-sm text-[var(--color-text)]">No hay suscripciones registradas.</p>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            {subscriptions.map((subscription) => (
              <div
                key={subscription.id_subscription}
                className="bg-[var(--color-bg)] rounded-lg sm:rounded-xl border border-[var(--color-primary)] shadow-sm p-3 sm:p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                  <h4 className="font-semibold text-xs sm:text-sm text-[var(--color-text)] capitalize line-clamp-1">
                    {subscription.Package?.name_package}
                  </h4>
                  <span
                    className={`w-fit px-2 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {subscription.status === "active" ? "Activa" : "Cancelada"}
                  </span>
                </div>
                <p className="text-[var(--color-text)] text-xs sm:text-sm line-clamp-2">
                  {subscription.Package?.description_package}
                </p>
                <div className="mt-2 text-[var(--color-text)] text-xs sm:text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Inicio:</span>{" "}
                    {new Date(subscription.start_date).toLocaleDateString("es-CO")}
                  </p>
                  <p>
                    <span className="font-semibold">Fin:</span>{" "}
                    {new Date(subscription.end_date).toLocaleDateString("es-CO")}
                  </p>
                  <p>
                    <span className="font-semibold">Duración:</span>{" "}
                    {subscription.Package?.duration_package} días
                  </p>
                  <p>
                    <span className="font-semibold">Clases:</span>{" "}
                    {subscription.Package?.class_limit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
