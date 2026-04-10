import api from "../lib/api";

export const login = async (kode_user: string, password: string) => {
  const response = await api.post("/login", { kode_user, password });
  localStorage.setItem("auth_token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
  return response.data;
};

export const logout = async () => {
  await api.post("/logout");
  localStorage.removeItem("auth_token");
};

export const getUser = async () => {
  const response = await api.get("/user");
  return response.data;
};
