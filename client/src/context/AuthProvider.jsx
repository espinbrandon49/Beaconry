import React, { useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth.api";
import { disconnectSocket } from "../socket/socket";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function bootstrap() {
    setLoading(true);
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    bootstrap();
  }, []);

  async function login({ email, password }) {
    const u = await authApi.login({ email, password });
    setUser(u);
    return u;
  }

  async function signup({ email, name, password }) {
    const u = await authApi.signup({ email, name, password });
    setUser(u);
    return u;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      disconnectSocket();
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refresh: bootstrap,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}