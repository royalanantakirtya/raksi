import api from "../lib/api";

// Helper to set a cookie
function setCookie(name: string, value: string, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

// Helper to remove a cookie
function removeCookie(name: string) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export const login = async (kode_user: string, password: string) => {
  const response = await api.post("/login", { kode_user, password });
  const token = response.data.token;
  const user = response.data.user;

  // Store in both localStorage and cookie (middleware reads cookie)
  localStorage.setItem("auth_token", token);
  localStorage.setItem("user", JSON.stringify(user));
  setCookie("auth_token", token);

  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch {
    // ignore logout errors
  }
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user");
  removeCookie("auth_token");
};

export const getUser = async () => {
  const response = await api.get("/user");
  return response.data;
};
