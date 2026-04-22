// =============================================
// CONTROLLER DE EQUIPAMENTOS
// =============================================
// TODO (alunos): implementar cada função abaixo.
// Cada função recebe (req, res) e deve retornar uma resposta JSON.

const EquipamentoModel = require('../model/equipamentModel');


class EquipamentoController {

  static async create(req, res) {
    try {
      const { nome, categoria, patrimonio, descricao } = req.body;

      if (!nome || !categoria || !patrimonio) {
        return res.status(400).json({ erro: "Nome, categoria e patrimônio são obrigatórios!" });
      }

      const patrimonioExists = await EquipamentoModel.findByPatrimonio(patrimonio);
      if (patrimonioExists) {
        return res.status(409).json({ erro: "Já existe um equipamento com este patrimônio!" });
      }

      const novoId = await EquipamentoModel.create({ nome, categoria, patrimonio, status: 'operacional', descricao: descricao || '' });

      return res.status(201).json({ ok: true, mensagem: "Equipamento cadastrado com sucesso!", equipamento_id: novoId });
    } catch (erro) {
      console.error("Erro ao cadastrar equipamento:", erro);
      return res.status(500).json({ erro: "Erro interno do servidor!" });
    }
  }

  static async listFunctioning(req, res) {
    try {
      const equipamentos = await EquipamentoModel.listFunctional();
      return res.status(200).json({ ok: true, equipamentos });
    } catch (erro) {
      console.error("Erro ao listar operacionais:", erro);
      return res.status(500).json({ erro: "Erro ao buscar equipamentos operacionais!" });
    }
  }

  static async listAll(req, res) {
    try {
      const equipamentos = await EquipamentoModel.findAll();
      return res.status(200).json({ ok: true, equipamentos });
    } catch (erro) {
      console.error("Erro ao listar todos equipamentos:", erro);
      return res.status(500).json({ erro: "Erro ao buscar equipamentos!" });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const equipamento = await EquipamentoModel.findById(id);

      if (!equipamento) {
        return res.status(404).json({ erro: "Equipamento não encontrado!" });
      }

      return res.status(200).json({ ok: true, equipamento });
    } catch (erro) {
      console.error("Erro ao buscar equipamento:", erro);
      return res.status(500).json({ erro: "Erro ao buscar equipamento!" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ erro: "O novo status é obrigatório!" });
      }

      const atualizado = await EquipamentoModel.updateStatus({id, status});

      if (!atualizado) {
        return res.status(404).json({ erro: "Equipamento não encontrado!" });
      }

      return res.status(200).json({ ok: true, mensagem: `Status do equipamento atualizado para '${status}'!` });
    } catch (erro) {
      console.error("Erro ao atualizar status do equipamento:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar o equipamento!" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, categoria, status, descricao } = req.body;

      if (!nome || !categoria) {
        return res.status(400).json({ erro: "Nome, categoria e status são obrigatórios para a atualização!" });
      }

      const atualizado = await EquipamentoModel.update(id, { nome, categoria, status, descricao });

      if (!atualizado) {
        return res.status(404).json({ erro: "Equipamento não encontrado!" });
      }

      return res.status(200).json({ ok: true, mensagem: "Equipamento atualizado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao atualizar equipamento:", erro);
      return res.status(500).json({ erro: "Erro ao atualizar o equipamento!" });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const deletado = await EquipamentoModel.deleteById(id);

      if (!deletado) {
        return res.status(404).json({ erro: "Equipamento não encontrado." });
      }

      return res.status(200).json({ ok: true, mensagem: "Equipamento deletado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao deletar equipamento:", erro);

      if (erro.code === 'ER_ROW_IS_REFERENCED_2' || erro.code === 'ER_ROW_IS_REFERENCED') {
        return res.status(409).json({
          erro: "Não é possível deletar este equipamento pois já existem chamados atrelados a ele. Considere mudar o status para 'desativado'."
        });
      }

      return res.status(500).json({ erro: "Erro interno ao deletar o equipamento." });
    }
  }
}

module.exports = EquipamentoController;