import { http } from "@/lib/http";

export const dashboardService = {
  // Dashboard do admin com KPIs e estatísticas
  admin: () =>http.get("/dashboard/admin"),

  // Dashboard do técnico com fila de chamados
  tecnico: () => http.get("/dashboard/tecnico"),

  // Dashboard do cliente com seus chamados
  cliente: () => http.get("/dashboard/cliente"),
};
