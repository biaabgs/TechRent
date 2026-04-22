// =============================================
// CONTROLLER DE CHAMADOS
// =============================================
// TODO (alunos): implementar cada função abaixo.
//
// Fluxo de status:
//   aberto -> em_atendimento -> resolvido
//                           -> cancelado

const { withTransaction } = require('../config/database');
const EquipamentoModel = require('../model/equipamentModel');
const ChamadaModel = require('../model/chamadaModel');

class ChamadaController {

  static async list(req, res) {
    try {
      const { id, nivel_acesso } = req.usuario;
      const isClient = nivel_acesso === "cliente";

      const chamados = await ChamadaModel.findByAccessLevel({ id, cliente: isClient });

      return res.status(200).json({ ok: true, chamados });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar chamados!" });
    }
  }

  static async findById(req, res) {
    try {
      const { id } = req.params;
      const chamado = await ChamadaModel.findById(id);

      if (!chamado) {
        return res.status(404).json({ erro: "Chamado não encontrado!" });
      }

      if (req.usuario?.nivel_acesso === "cliente" && chamado.cliente_id !== req.usuario.id) {
        return res.status(403).json({ erro: "Você não tem permissão para visualizar este chamado." });
      }

      return res.status(200).json({ ok: true, chamado });
    } catch (erro) {
      console.error("Erro ao buscar chamado por ID:", erro);
      return res.status(500).json({ erro: "Erro ao buscar detalhes do chamado!" });
    }
  }

  static async create(req, res) {
    try {
      const { titulo, descricao, equipamento_id, prioridade } = req.body;
      const cliente_id = req.usuario.id;

      if (!titulo || !descricao || !equipamento_id) {
        return res.status(400).json({ erro: "Título, descrição e equipamento são obrigatórios." });
      }

      const equipamento = await EquipamentoModel.findById(equipamento_id);
      if (!equipamento) {
        return res.status(404).json({ erro: "Equipamento não encontrado." });
      }

      if (equipamento.status !== "operacional") {
        return res.status(409).json({ erro: "Apenas equipamentos operacionais podem receber novos chamados." });
      }

      const novoChamado = await withTransaction(async (connection) => {
        const chamadoId = await ChamadaModel.create(
          {
            titulo,
            descricao,
            cliente_id,
            equipamento_id,
            tecnico_id: null,
            prioridade: prioridade || "media",
            status: "aberto",
          },
          connection
        );

        await EquipamentoModel.updateStatus({ id: equipamento_id, status: 'em_manutencao' }, connection);
        return chamadoId;
      });

      return res.status(201).json({
        ok: true,
        mensagem: "Chamado aberto com sucesso! O equipamento agora consta como 'em manutenção'!",
        chamado_id: novoChamado
      });
    } catch (erro) {
      console.error("Erro ao criar chamado:", erro);
      return res.status(500).json({ erro: "Erro interno ao abrir o chamado!" });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, tecnico_id } = req.body;

      if (!status) {
        return res.status(400).json({ erro: "O novo status é obrigatório!" });
      }

      const chamado = await ChamadaModel.findById(id);
      if (!chamado) {
        return res.status(404).json({ erro: "Chamado não encontrado!" });
      }

      if (req.usuario?.nivel_acesso === "tecnico" && tecnico_id && tecnico_id !== req.usuario.id) {
        return res.status(403).json({ erro: "Você só pode assumir ou atualizar chamados em seu próprio nome." });
      }

      const tecnicoResponsavel =
        tecnico_id ||
        (status === 'em_atendimento' && ['tecnico', 'admin'].includes(req.usuario?.nivel_acesso)
          ? req.usuario.id
          : null);

      if (
        tecnicoResponsavel &&
        chamado.tecnico_id &&
        chamado.tecnico_id !== tecnicoResponsavel &&
        req.usuario?.nivel_acesso !== "admin"
      ) {
        return res.status(409).json({ erro: "Este chamado já está atribuído a outro técnico." });
      }

      await withTransaction(async (connection) => {
        if (tecnicoResponsavel) {
          await ChamadaModel.setTecnico({ id, tecnico_id: tecnicoResponsavel }, connection);
        }

        await ChamadaModel.updateStatus({ id, status }, connection);

        if (status === 'resolvido' || status === 'cancelado') {
          await EquipamentoModel.updateStatus({ id: chamado.equipamento_id, status: 'operacional' }, connection);
        }
      });

      return res.status(200).json({ ok: true, mensagem: "Status atualizado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao atualizar status:", erro);
      return res.status(500).json({ erro: "Erro interno ao atualizar chamado!" });
    }
  }
}

module.exports = ChamadaController;
