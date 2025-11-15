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
  isLoggedIn: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const savedToken = sessionStorage.getItem("token");
  const savedRole = sessionStorage.getItem("role");
  const [token, setToken] = useState<string | null>(savedToken);
  const [role, setRole] = useState<string | null>(savedRole);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!savedToken);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      setIsLoggedIn(true);
    } else {
      sessionStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  }, [token]);

  // Keep role in sessionStorage when it changes
  useEffect(() => {
    if (role) {
      sessionStorage.setItem('role', role);
    } else {
      sessionStorage.removeItem('role');
    }
  }, [role]);

  // Helper: try to parse a role from a JWT token payload (if JWT used)
  const parseRoleFromToken = (t: string | null): string | null => {
    if (!t) return null;
    try {
      const parts = t.split('.');
      if (parts.length < 2) return null;
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);
      // common claim names: role, roles, isAdmin
      if (typeof payload.role === 'string') return payload.role;
      if (Array.isArray(payload.roles) && payload.roles.length > 0) return payload.roles[0];
      if (payload.isAdmin) return 'admin';
      return null;
    } catch (err) {
      return null;
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    // parse role from token if available
    const parsed = parseRoleFromToken(newToken);
    setRole(parsed);
    sessionStorage.setItem("token", newToken);
    if (parsed) sessionStorage.setItem('role', parsed);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
    setRole(null);
    sessionStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ token, role, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};