import { useAuth } from "../../context/AuthContext";

export const ProfileUser = () => {
  const { profile } = useAuth();

  const user = profile?.user;
  const subscriptions = profile?.subscriptionByUser || [];

  return (
    <section className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 shadow-md border border-[var(--color-primary)] max-w-6xl mx-auto">
      {/* Perfil del usuario */}
      <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-6">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xl font-bold">
              {user?.name_user?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{user?.name_user}</h2>
              <p className="text-[var(--color-text)] text-sm">{user?.email_user}</p>
            </div>
          </div>
          <p className="text-[var(--color-text)] text-sm">
            <span className="font-semibold">Rol:</span> {user?.role}
          </p>
          <p className="text-[var(--color-text)] text-sm">
            <span className="font-semibold">Certificado médico:</span>{" "}
            {user?.medical_certificated || "No registrado"}
          </p>
        </div>

        {/* Estado bloqueado */}
        <div className="mt-4 md:mt-0">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${user?.is_blocked
                ? "bg-red-200 text-red-700"
                : "bg-green-200 text-green-700"
              }`}
          >
            {user?.is_blocked ? "Cuenta bloqueada" : "Cuenta activa"}
          </span>
        </div>
      </div>

      <hr className="border-[var(--color-primary)] my-4" />

      {/* Historial de suscripciones */}
      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-4">
        Historial de suscripciones
      </h3>

      {subscriptions.length === 0 ? (
        <p className="text-[var(--color-text)] text-sm">No hay suscripciones registradas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id_subscription}
              className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-primary)] shadow-sm p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[var(--color-text)] capitalize">
                  {subscription.Package?.name_package}
                </h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${subscription.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {subscription.status}
                </span>
              </div>
              <p className="text-[var(--color-text)] text-sm">
                {subscription.Package?.description_package}
              </p>
              <div className="mt-2 text-[var(--color-text)] text-sm">
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
                  <span className="font-semibold">Límite de clases:</span>{" "}
                  {subscription.Package?.class_limit}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
