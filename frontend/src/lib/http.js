import { authService, STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from "@/services/auth.service";

async function request(path, options = {}) {
  const token = authService.getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    if (response.status === 401) {
      authService.clearSession(); 

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }

    if (response.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/unauthorized";
      }
    }

    const message = data?.error || data?.erro || data?.mensagem || "Erro na requisição";
    throw new Error(message);
  }

  return data;
}

export const http = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body) =>
    request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: (path, body) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};