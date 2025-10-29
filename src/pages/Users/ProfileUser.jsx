import { useAuth } from "../../context/AuthContex";

export const ProfileUser = () => {
  const { profile } = useAuth();

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mi Perfil</h2>
      <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
        <div><span className="font-medium">Nombre: </span>{profile?.user.name_user || profile?.full_name || "-"}</div>
        <div><span className="font-medium">Email: </span>{profile?.user.email_user || "-"}</div>
        <div><span className="font-medium">Role: </span>{profile?.user.role || "-"}</div>
        <div><span className="font-medium">Certificado medico: </span>{profile?.user.medical_certificated || "-"}</div>
      </div>
    </section>
  );
}