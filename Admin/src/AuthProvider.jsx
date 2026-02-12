import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 important

  useEffect(() => {
  const storedAuth =
    localStorage.getItem("auth") || sessionStorage.getItem("auth");

  if (storedAuth) {
    const authData = JSON.parse(storedAuth);
    setUser(authData);

    axios.defaults.headers.common["Authorization"] =
      `Bearer ${authData.token}`;
  }

  setLoading(false);
}, []);


  const login = (token, user, rememberMe) => {
  const authData = { token, user };

  setUser(authData);

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  if (rememberMe) {
    localStorage.setItem("auth", JSON.stringify(authData));
  } else {
    sessionStorage.setItem("auth", JSON.stringify(authData));
  }
};


  const logout = () => {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");

  delete axios.defaults.headers.common["Authorization"];
  setUser(null);
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
