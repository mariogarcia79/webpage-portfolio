import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  token: string | null;
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
  const [token, setToken] = useState<string | null>(savedToken);
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

  const login = (newToken: string) => {
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
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