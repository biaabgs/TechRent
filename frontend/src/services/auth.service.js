"use client";

import { http } from "@/lib/http";

export const STORAGE_TOKEN_KEY = "techrent_token";
export const STORAGE_USER_KEY = "techrent_user";

export const authService = {
  login: ({ email, senha }) => http.post("/auth/login", { email, senha }),
  
  register: ({ nome, email, senhaSemHash, nivel_acesso }) =>
    http.post("/auth/registro", { nome, email, senhaSemHash, nivel_acesso }),
  
  setSession: ({ token, user }) => {
    if (typeof window === "undefined") return;
    if (token) window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
    if (user) window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  },

  clearSession: () => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_TOKEN_KEY);
    window.localStorage.removeItem(STORAGE_USER_KEY);
  },

  getStoredUser: () => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(STORAGE_TOKEN_KEY);
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!window.localStorage.getItem(STORAGE_TOKEN_KEY);
  }
};