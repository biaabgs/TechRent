const { query } = require('../config/database');

class ChamadaModel {
    static async create({ titulo, descricao, cliente_id, equipamento_id, tecnico_id, prioridade, status }, executor = null) {
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `INSERT INTO chamados (titulo, descricao, cliente_id, equipamento_id, tecnico_id, prioridade, status) VALUES (?,?,?,?,?,?,?)`;
        const [result] = await run(sql, [titulo, descricao, cliente_id, equipamento_id, tecnico_id, prioridade, status]);
        return result.insertId;
    };

    static async findById(id, executor = null) {
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `SELECT c.*, e.nome AS equipamento_nome, u.nome AS cliente_nome, t.nome AS tecnico_nome
                FROM chamados c
                JOIN equipamentos e ON c.equipamento_id = e.id
                JOIN usuarios u ON c.cliente_id = u.id
                LEFT JOIN usuarios t ON c.tecnico_id = t.id
                WHERE c.id = ?`;
        const [result] = await run(sql, [id]);
        return result[0] || null;
    }

    static async setTecnico({ id, tecnico_id }, executor = null) {
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `UPDATE chamados SET tecnico_id = ?, status = 'em_atendimento' WHERE id = ?`;
        const [result] = await run(sql, [tecnico_id, id]);
        return result.affectedRows > 0;
    }

    static async updateStatus({ id, status }, executor = null) {
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `UPDATE chamados SET status = ? WHERE id = ?`;
        const [result] = await run(sql, [status, id]);
        return result.affectedRows > 0;
    }

    static async findByAccessLevel({ id, cliente }) {
        let sql = `
                SELECT c.*, e.nome AS equipamento_nome, u.nome AS cliente_nome, t.nome AS tecnico_nome
                FROM chamados c
                JOIN equipamentos e ON c.equipamento_id = e.id
                JOIN usuarios u ON c.cliente_id = u.id
                LEFT JOIN usuarios t ON c.tecnico_id = t.id
            `;
        if (cliente) {
            sql += ` WHERE c.cliente_id = ? ORDER BY c.aberto_em DESC`;
            return await query(sql, [id]);
        } else {
            sql += ` ORDER BY c.status ASC, c.aberto_em DESC`; // Organiza por status para o técnico
            return await query(sql, []);
        }
    }

    static async viewTecnico() {
        const sql = `
            SELECT
                c.id AS chamado_id,
                c.titulo,
                c.descricao,
                c.equipamento_id,
                c.prioridade,
                c.status,
                u_cliente.nome AS solicitante,
                e.nome AS equipamento,
                e.categoria,
                e.patrimonio,
                u_tec.nome AS tecnico_responsavel,
                c.aberto_em,
                c.atualizado_em
            FROM chamados c
            JOIN usuarios u_cliente ON c.cliente_id = u_cliente.id
            JOIN equipamentos e ON c.equipamento_id = e.id
            LEFT JOIN usuarios u_tec ON c.tecnico_id = u_tec.id
            WHERE c.status IN ('aberto', 'em_atendimento')
            ORDER BY
                FIELD(c.prioridade, 'alta', 'media', 'baixa'),
                c.aberto_em ASC
        `;
        return await query(sql, []);
    }

    static async viewChamadas() {
        const sql = `SELECT status, COUNT(*) AS total FROM chamados WHERE status IS NOT NULL GROUP BY status ORDER BY status`;
        return await query(sql, []);
    }

    static async getKpiMetrics() {
        const sql = `
            SELECT
                COUNT(CASE WHEN status IN ('aberto', 'em_atendimento') THEN 1 END) as chamados_abertos,
                COUNT(CASE WHEN status = 'em_atendimento' THEN 1 END) as em_progresso,
                ROUND(
                    (COUNT(CASE WHEN status = 'resolvido' AND DATE(aberto_em) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END) /
                    COUNT(CASE WHEN DATE(aberto_em) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) THEN 1 END)) * 100,
                    1
                ) as taxa_resolucao_30d
            FROM chamados
            WHERE DATE(aberto_em) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                OR status IN ('aberto', 'em_atendimento')
        `;
        const result = await query(sql, []);
        return result[0] || { chamados_abertos: 0, em_progresso: 0, taxa_resolucao_30d: 0 };
    }

    static async getAtividadesRecentes() {
        const sql = `SELECT * FROM view_atividades_recentes LIMIT 6`;
        return await query(sql, []);
    }

    static async update(id, { descricao, tecnico_id, prioridade, status }) {
        const sql = `UPDATE chamados SET descricao = ?, tecnico_id = ?, prioridade = ?, status = ? WHERE id = ?`;
        const result = await query(sql, [ descricao, tecnico_id, prioridade, status, id]);
        return result.affectedRows > 0;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM chamados WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ChamadaModel;
