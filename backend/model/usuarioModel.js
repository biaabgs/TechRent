const { query } = require('../config/database');

class UserModel {
    static async criar({ nome, email, senha, nivel_acesso }) {
        const sql = `INSERT INTO usuarios ( nome, email, senha, nivel_acesso) VALUES (?, ?, ?, ?)`
        const result = await query(sql, [nome, email, senha, nivel_acesso]);
        return result.insertId;
    };

    static async listarTodos() {
        const sql = `SELECT * FROM usuarios`;
        return await query(sql, []);
    }

    static async buscarPorId(id) {
        const sql = `SELECT * FROM usuarios WHERE id = ?`
        const result = await query(sql, [id]);
        return result[0] || null;
    };

    static async buscarPorEmail(email) {
        const sql = `SELECT * FROM usuarios WHERE email = ?`
        const result = await query(sql, [email]);
        return result[0] || null;
    };

    static async atualizar({ id, nome, nivel_acesso }) {
        const sql = `UPDATE usuarios SET nome = ?, nivel_acesso = ? WHERE id = ?`;
        const result = await query(sql, [nome, nivel_acesso, id]);
        return result.affectedRows > 0;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM usuarios WHERE id = ?`;
        const result = await query(sql, [id]);
        return result.affectedRows > 0;
    };
};

module.exports = UserModel;