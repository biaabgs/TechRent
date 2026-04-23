import { http } from "@/lib/http";

export const equipamentosService = {
  // Listar equipamentos operacionais
  listar: () => http.get("/equipamentos"),

  // Listar TODOS equipamentos (admin)
  listarTodos: () => http.get("/equipamentos/todos"),

  // Buscar equipamento por ID
  buscarPorId: (id) => http.get(`/equipamentos/${id}`),

  // Criar equipamento (admin)
  criar: ({ nome, categoria, patrimonio, descricao }) =>
    http.post("/equipamentos", { nome, categoria, patrimonio, descricao }),

  // Atualizar equipamento (admin)
  atualizar: (id, { nome, categoria, status, descricao }) =>
    http.put(`/equipamentos/${id}`, { nome, categoria, status, descricao }),

  // Atualizar status do equipamento (admin/tecnico)
  atualizarStatus: (id, { status }) =>
    http.put(`/equipamentos/${id}/status`, { status }),

  // Deletar equipamento (admin)
  deletar: (id) => http.delete(`/equipamentos/${id}`),
};
