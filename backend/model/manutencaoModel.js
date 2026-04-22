const { query } = require("../config/database");

class ManutencaoModel {
    static async create({ chamado_id, equipamento_id, tecnico_id, descricao }, executor = null){
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `INSERT INTO historico_manutencao (chamado_id, equipamento_id, tecnico_id, descricao) VALUES (?,?,?,?)`;
        const [result] = await run(sql, [chamado_id, equipamento_id, tecnico_id, descricao]);
        return result.insertId;
    }

    static async findAll(){
        const sql = `
            SELECT m.*, u.nome AS tecnico_nome, e.nome AS equipamento_nome
            FROM historico_manutencao m
            JOIN usuarios u ON m.tecnico_id = u.id
            JOIN equipamentos e ON m.equipamento_id = e.id
            ORDER BY m.registrado_em DESC
        `;
        return await query(sql, []);
    }

    static async findByChamadoId(chamado_id) {
        const sql = `
            SELECT h.*, u.nome AS nome_tecnico 
            FROM historico_manutencao h
            JOIN usuarios u ON h.tecnico_id = u.id
            WHERE h.chamado_id = ?
            ORDER BY h.registrado_em ASC
        `;
        return await query(sql, [chamado_id]);
    }

    static async update(id, descricao) {
        const sql = `UPDATE historico_manutencao SET descricao = ? WHERE id = ?`;
        const result = await query(sql, [descricao, id]);
        return result.affectedRows > 0;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM historico_manutencao WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ManutencaoModel;
