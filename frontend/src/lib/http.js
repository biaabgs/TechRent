import { getToken } from "@/lib/auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {

    if (response.status === 401) {
      localStorage.clear("techrent_user");
      localStorage.clear("techrent_user");
      window.location.href = "/";
    }

    if(response.status === 403){
      window.location.href = "/unauthorized";
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
  delete: (path) =>
    request(path, {
      method: "DELETE",
    }),
};
