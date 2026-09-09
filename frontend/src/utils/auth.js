import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getCurrentUser = () => {
  const token = getToken();

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token tidak valid:", error);
    return null;
  }
};

export const getUserRole = () => {
  const user = getCurrentUser();
  return user?.role || null;
};

export const isAuthenticated = () => {
  return !!getToken() && !!getCurrentUser();
};

export const logout = () => {
  localStorage.removeItem("token");
};