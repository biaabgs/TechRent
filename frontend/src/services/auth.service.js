import { http } from "@/lib/http";

export const authService = {
  login: ({ email, senha }) => http.post("/auth/login", { email, senha }),
  register: ({ nome, email, senhaSemHash, nivel_acesso }) =>
    http.post("/auth/registro", { nome, email, senhaSemHash, nivel_acesso }),
};
