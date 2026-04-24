import api from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((r) => r.data),

  register: (nama, email, password) =>
    api.post("/auth/register", { nama, email, password }).then((r) => r.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () => api.get("/auth/me").then((r) => r.data),

  refreshToken: () => api.post("/auth/refresh").then((r) => r.data),
};
