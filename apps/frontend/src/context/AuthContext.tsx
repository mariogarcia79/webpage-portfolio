import { User } from "../types/user";
import { API_BASE_URL } from "../constants/constants";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Role = User["role"]; // "admin" | "user"

interface AuthContextType {
  role: Role | null;
  _id: string | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [_id, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  async function getUser(): Promise<User> {
    const res = await fetch(`${API_BASE_URL}/auth/user`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Error fetching user info");
    return res.json();
  }

  const login = async () => {
    const user = await getUser();
    setUserId(user._id);
    setRole(user.role);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserId(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    getUser()
      .then((user) => {
        setUserId(user._id);
        setRole(user.role);
        setIsLoggedIn(true);
      })
      .catch(() => {});
  }, []);

  return (
    <AuthContext.Provider value={{ role, _id, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an AuthProvider");
  return ctx;
};
