import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContex";
import { UserSideBar } from "./UserSideBar";
import { HeaderUser } from "./HeaderUser";

export default function UserLayout() {
    const { profile, authLoading } = useAuth();

    if (authLoading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando…</div>;
    }

    if (!authLoading && !profile) return <Navigate to="/login" replace />;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <UserSideBar />
            <div className="flex-1 flex flex-col sm:ml-64">
                <HeaderUser />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}