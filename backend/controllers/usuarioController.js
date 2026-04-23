const UsuarioModel = require('../model/usuarioModel');

class UsuarioController {

  // ── ROTA: GET /usuarios (Para o painel Admin)
  static async listarTodos(req, res) {
    try {
      // Usa o método listarTodos() do seu UsuarioModel
      const usuarios = await UsuarioModel.listarTodos();

      // Remove a senha do array antes de mandar para o React (Segurança)
      const usuariosSemSenha = usuarios.map(({ senha, ...resto }) => resto);

      return res.status(200).json(usuariosSemSenha);
    } catch (error) {
      console.error("Erro no UsuarioController.listarTodos:", error);
      return res.status(500).json({ error: "Erro ao buscar usuários!" });
    }
  }

  // ── ROTA: PUT /usuarios/:id (Para salvar a edição do Modal)
  static async atualizar(req, res) {
    const { id } = req.params;
    const { nome, nivel_acesso } = req.body;

    if (!nome || !nivel_acesso) {
      return res.status(400).json({ error: "Nome e nível de acesso são obrigatórios!" });
    }

    try {
      // 1. Verifica se o usuário existe usando buscarPorId() do seu UsuarioModel
      const usuarioExiste = await UsuarioModel.buscarPorId(id);
      if (!usuarioExiste) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
      }

      // 2. Valida os níveis de acesso permitidos
      if (nivel_acesso !== 'cliente' && nivel_acesso !== 'admin' && nivel_acesso !== 'tecnico') {
        return res.status(400).json({ error: "Nível de acesso inválido!" });
      }

      // 3. Atualiza usando o atualizar() do seu UsuarioModel
      // OBS: Estamos enviando um objeto { id, nome, nivel_acesso }
      const atualizou = await UsuarioModel.atualizar({ id, nome, nivel_acesso });

      if (!atualizou) {
        return res.status(400).json({ error: "Nenhuma alteração foi feita ou ID inválido." });
      }

      return res.status(200).json({
        ok: true,
        mensagem: "Usuário atualizado com sucesso!"
      });
    } catch (error) {
      console.error("Erro no UsuarioController.atualizar:", error);
      return res.status(500).json({ error: "Erro interno do servidor ao atualizar!" });
    }
  }

  static async deletar(req, res) {
    try {
      // Pega o ID que vem na URL da requisição (ex: /api/usuarios/5)
      const { id } = req.params;

      // Chama o método do seu model que executa o DELETE no banco de dados
      const resultado = await UsuarioModel.deletar(id);

      if (!resultado) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
      }

      return res.status(200).json({ ok: true, mensagem: "Usuário deletado com sucesso!" });

    } catch (erro) {
      console.error("Erro ao deletar usuário:", erro);
      return res.status(500).json({ erro: "Erro interno ao tentar deletar o usuário." });
    }
  }
}

module.exports = UsuarioController;