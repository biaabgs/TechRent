const { query } = require('../config/database');

class EquipamentoModel {
    static async create({nome, categoria, patrimonio, status, descricao}, executor = null){
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `INSERT INTO equipamentos (nome, categoria, patrimonio, status,descricao) values (?,?,?,?,?)`
        const [result] = await run(sql, [nome, categoria, patrimonio, status, descricao]);
        return result.insertId;
    }

    static async findById(id, executor = null){
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `SELECT * FROM equipamentos WHERE id = ?`;
        const [result] = await run(sql, [id]);
        return result[0] || null;
    }

    static async findByPatrimonio(patrimonio){
        const sql = `SELECT * FROM equipamentos WHERE patrimonio = ?`;
        const result = await query(sql, [patrimonio]);
        return result[0] || null;
    }

    static async findAll(){
        const sql = `SELECT * FROM equipamentos`;
        return await query(sql, []);
    }

    static async listFunctional(){
        const sql = `SELECT * FROM view_equipamentos_operacionais`
        return await query(sql, []);
    }

    static async viewEquipament(){
        const sql = `SELECT status, COUNT(*) AS total FROM equipamentos WHERE status IS NOT NULL GROUP BY status ORDER BY status`
        return await query(sql, []);
    }

    static async getEquipamentosCriticos(){
        const sql = `SELECT COUNT(*) as total FROM equipamentos WHERE status = 'em_manutencao'`;
        const result = await query(sql, []);
        return result[0]?.total || 0;
    }

    static async update(id, {nome, categoria, status, descricao}, executor = null){
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `UPDATE equipamentos SET nome = ?, categoria = ?, status = ?, descricao = ? WHERE id = ?`;
        const [result] = await run(sql, [nome, categoria, status, descricao, id]);
        return result.affectedRows > 0;
    }

    static async updateStatus({ id, status }, executor = null){
        const run = executor ? executor.execute.bind(executor) : async (sql, params) => [await query(sql, params)];
        const sql = `UPDATE equipamentos SET status = ? WHERE id = ?`;
        const [result] = await run(sql, [status, id]);
        return result.affectedRows > 0;
    }

    static async deleteById(id){
        const sql = `DELETE FROM equipamentos WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = EquipamentoModel;
