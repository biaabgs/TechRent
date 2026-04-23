import { http } from "@/lib/http";

export const chamadosService = {
  list: () => http.get("/chamados"),
  findById: (id) => http.get(`/chamados/${id}`),
  create: (payload) => http.post("/chamados", payload),
  updateStatus: (id, payload) => http.put(`/chamados/${id}/status`, payload),
};
