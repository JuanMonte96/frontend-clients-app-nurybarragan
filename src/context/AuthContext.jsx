import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/authServices";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const id_user = localStorage.getItem("id_user");

  const refreshProfile = async (id_user) => {
    try {
      const data = await getProfile(id_user);
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthLoading(false);
      return;
    }
    refreshProfile(id_user);
  }, []);

  return (
    <AuthContext.Provider value={{ profile, setProfile, refreshProfile, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}