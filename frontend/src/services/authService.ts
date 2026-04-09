import api from "../lib/api";

export const login = async (email: string, password: string) => {
  const response = await api.post("/login", { email, password });
  localStorage.setItem("auth_token", response.data.token);
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
