import { http } from "@/lib/http";

export const manutencaoService = {
  // Listar histórico de manutenção (com filtro opcional por chamado)
  listar: (chamadoId) =>
    http.get(chamadoId ? `/manutencao?chamado_id=${encodeURIComponent(chamadoId)}` : "/manutencao"),

  // Registrar manutenção (técnico resolve chamado)
  registrar: ({ chamado_id, equipamento_id, descricao, status_equipamento }) =>
    http.post("/manutencao", { chamado_id, equipamento_id, descricao, status_equipamento }),

  // Atualizar descrição de manutenção (admin/tecnico)
  atualizarDescricao: (id, { descricao }) =>
    http.put(`/manutencao/${id}`, { descricao }),
};
