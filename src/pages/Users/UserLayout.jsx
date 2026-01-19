import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserSideBar } from "./UserSideBar";
import { HeaderUser } from "./HeaderUser";

export default function UserLayout() {
    const { profile, authLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
    }

    if (!authLoading && !profile) return <Navigate to="/login" replace />;

    return (
        <div className="flex min-h-screen bg-[var(--color-bg)]">
            <UserSideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col w-full">
                <HeaderUser sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}