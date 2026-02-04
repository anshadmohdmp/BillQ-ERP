import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ Restore session ONLY if remembered
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setUser(JSON.parse(storedAuth));
    }
  }, []);

  // ✅ Login with rememberMe
  const login = (token, username, rememberMe) => {
    const authData = { token, username };

    setUser(authData);

    if (rememberMe) {
      localStorage.setItem("auth", JSON.stringify(authData));
    }
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
