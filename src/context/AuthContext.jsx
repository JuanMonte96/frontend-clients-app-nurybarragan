import { createContext, useContext, useEffect, useState, useMemo, useRef } from "react";
import { getProfile } from "../services/authServices";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const hasInitialized = useRef(false);

  // Usar useMemo para evitar que id_user cambie en cada render
  const id_user = useMemo(() => localStorage.getItem("id_user"), []);

  const refreshProfile = async (userId) => {
    console.log("AuthContext: refreshProfile called with userId:", userId);
    setAuthLoading(true);
    try {
      const data = await getProfile(userId);
      console.log("Profile loaded:", data);
      setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
      console.log("AuthContext: Setting profile to null due to error");
      setProfile(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Solo ejecutar una vez en el mount inicial
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("id_user");
    
    // Solo cargar perfil si AMBOS token e id_user existen
    if (token && storedUserId) {
      refreshProfile(storedUserId);
    }
    // Si no hay token, no hacer nada, simplemente dejar que la app siga
  }, []);

  return (
    <AuthContext.Provider value={{ profile, setProfile, refreshProfile, authLoading, id_user }}>
      {children}
    </AuthContext.Provider>
  );
}