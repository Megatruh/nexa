/**
 * useAuth - Custom hook untuk autentikasi
 */

import { useAuthStore } from "../store/authStore";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth, isLoading, setLoading } =
    useAuthStore();
  const navigate = useNavigate();

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        // TODO: Ganti dengan API call nyata
        // const res = await authService.login(email, password);
        // Simulasi login sukses
        await new Promise((r) => setTimeout(r, 800));
        setAuth(
          { id: "1", nama: "Pengguna NEXA", email },
          "mock-token-12345"
        );
        navigate(ROUTES.HOME);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setAuth, setLoading]
  );

  const register = useCallback(
    async (nama, email, password) => {
      setLoading(true);
      try {
        await new Promise((r) => setTimeout(r, 1000));
        setAuth({ id: "1", nama, email }, "mock-token-12345");
        navigate(ROUTES.HOME);
        return { success: true };
      } catch (err) {
        return { success: false, message: err.message };
      } finally {
        setLoading(false);
      }
    },
    [navigate, setAuth, setLoading]
  );

  const logout = useCallback(() => {
    clearAuth();
    navigate(ROUTES.LOGIN);
  }, [clearAuth, navigate]);

  return { user, token, isAuthenticated, isLoading, login, register, logout };
}
