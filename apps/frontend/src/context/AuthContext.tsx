import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  _id: string | null;
  isLoggedIn: boolean;

  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const parseJwt = (token: string | null) => {
    if (!token) return null;
    try {
      const payloadJson = atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(payloadJson);
    } catch {
      return null;
    }
  };

  const parseUserIdFromToken = (token: string | null): string | null => {
    const payload = parseJwt(token);
    return payload?._id || null;
  };

  const parseRoleFromToken = (token: string | null): string | null => {
    const payload = parseJwt(token);
    if (!payload) return null;
    if (typeof payload.role === "string") return payload.role;
    if (Array.isArray(payload.roles) && payload.roles.length > 0) return payload.roles[0];
    if (payload.isAdmin) return "admin";
    return null;
  };

  // Initialize state from sessionStorage
  const [token, setToken] = useState<string | null>(sessionStorage.getItem("token"));
  const [_id, setUserId] = useState<string | null>(parseUserIdFromToken(token));
  const [role, setRole] = useState<string | null>(parseRoleFromToken(token));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);

  // Persist token & derived values to sessionStorage
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("_id", _id || "");
      if (role) sessionStorage.setItem("role", role);
      setIsLoggedIn(true);
    } else {
      sessionStorage.clear();
      setIsLoggedIn(false);
    }
  }, [token, _id, role]);

  // LOGIN
  const login = (newToken: string) => {
    setToken(newToken);
    setUserId(parseUserIdFromToken(newToken));
    setRole(parseRoleFromToken(newToken));
  };

  // LOGOUT
  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ token, role, _id, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return ctx;
};
