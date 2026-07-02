import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, token) => {
    const authenticatedUser = token
      ? {
          ...userData,
          token,
        }
      : userData;

    setUser(authenticatedUser);
    localStorage.setItem("user", JSON.stringify(authenticatedUser));

    if (token) {
      localStorage.setItem("token", token);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
