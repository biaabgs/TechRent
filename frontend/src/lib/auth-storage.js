const STORAGE_TOKEN_KEY = "techrent_token";
const STORAGE_USER_KEY = "techrent_user";

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function setSession({ token, user }) {
  if (typeof window === "undefined") return;

  if (token) {
    window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }

  if (user) {
    window.localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_TOKEN_KEY);
  window.localStorage.removeItem(STORAGE_USER_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_USER_KEY);
  if (!raw) return null;
  return safeJsonParse(raw);
}

export function parseJwtPayload(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = decodeURIComponent(
      atob(payload)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(normalized);
  } catch {
    return null;
  }
}

export function getSessionUser() {
  const stored = getStoredUser();
  if (stored?.nivel_acesso) return stored;

  const token = getToken();
  const payload = parseJwtPayload(token);
  if (!payload) return null;

  return {
    id: payload.id,
    nome: payload.nome,
    email: payload.email,
    nivel_acesso: payload.nivel_acesso,
  };
}

export function isAuthenticated() {
  return Boolean(getToken());
}
