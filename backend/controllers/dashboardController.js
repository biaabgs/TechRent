// =============================================
// CONTROLLER DE DASHBOARD
// =============================================
// Usa as VIEWS do banco para retornar dados agregados.

const ChamadaModel = require("../model/chamadaModel");
const EquipamentoModel = require("../model/equipamentModel");

class DashboardController {
  static async viewAdmin(req, res) {
    try {
      const [
        chamados,
        equipamentos,
        kpis,
        equipamentosCriticos,
        atividades
      ] = await Promise.all([
        ChamadaModel.viewChamadas(),
        EquipamentoModel.viewEquipament(),
        ChamadaModel.getKpiMetrics(),
        EquipamentoModel.getEquipamentosCriticos(),
        ChamadaModel.getAtividadesRecentes()
      ]);

      return res.status(200).json({
        ok: true,
        kpis: {
          chamados_abertos: kpis.chamados_abertos || 0,
          em_progresso: kpis.em_progresso || 0,
          taxa_resolucao: kpis.taxa_resolucao_30d || 0,
          equipamentos_criticos: equipamentosCriticos
        },
        estatisticas_chamados: chamados,
        estatisticas_equipamentos: equipamentos,
        atividades_recentes: atividades,
        gerado_em: new Date()
      });
    } catch (erro) {
      console.error("Erro ao gerar dashboard admin:", erro);
      return res.status(500).json({ erro: "Erro ao carregar dados do painel administrativo." });
    }
  }

  static async viewTecnico(req, res) {
    try {

      const painel = await ChamadaModel.viewTecnico();

      return res.status(200).json({ ok: true, painel, gerado_em: new Date() });
    } catch (erro) {
      console.error("Erro ao carregar painel técnico:", erro);
      return res.status(500).json({ erro: "Erro ao carregar a fila de chamados!" });
    }
  }

  static async viewCliente(req, res) {
    try {
      const cliente_id = req.usuario.id;

      const chamados = await ChamadaModel.findByAccessLevel({ id: cliente_id, cliente: true });

      return res.status(200).json({ ok: true, chamados, gerado_em: new Date() });
    } catch (erro) {
      console.error("Erro ao carregar painel cliente:", erro);
      return res.status(500).json({ erro: "Erro ao carregar seus chamados!" });
    }
  }
}

module.exports = DashboardController;