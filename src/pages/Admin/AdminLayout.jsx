import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import { AdminSideBar } from "./AdminSideBar";
import { AdminHeader } from "./AdminHeader";

export const AdminLayout = () => {
  const { profile, authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = profile?.user?.role;

  if (authLoading) {
    return <LoadingSpinner fullscreen message="Validando acceso administrativo..." />;
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <AdminSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col w-full">
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
