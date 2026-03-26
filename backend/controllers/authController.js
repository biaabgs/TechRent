// =============================================
// CONTROLLER DE AUTENTICAÇÃO
// =============================================
// TODO (alunos): implementar as funções registro e login.
//
// Dicas:
//   - Use bcryptjs para criptografar a senha antes de salvar (registro)
//   - Use bcryptjs para comparar a senha no login (bcrypt.compare)
//   - Use jsonwebtoken (jwt.sign) para gerar o token após login bem-sucedido
//   - O payload do token deve ter: id, nome, email, nivel_acesso
//   - NUNCA coloque a senha no payload do token!

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// POST /auth/registro - cria um novo usuário
const registro = async (req, res) => {
  // TODO
  res.json({ mensagem: 'registro - não implementado' });
};

// POST /auth/login - autentica e retorna JWT
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || email.trim() === '') {
      return res.status(400).json({
        sucesso: false,
        erro: 'Email não pode estar vazio',
        mensagem: 'Email é obrigatório'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucesso: false,
        erro: 'Email inválido',
        mensagem: 'Formato de email inválido'
      });
    }

    if(!senha || senha.trim() === ''){
      return res.status(400).json({
        sucesso: false,
        erro: 'Senha não pode estar vazia',
        mensagem: 'A senha é obrigatória'
      })
    }

    
  } catch (error) {
    console.error('Erro ao fazer login: ', error);
    res.status(500).json({
      sucesso: false,
      erro: 'Erro interno do servidor',
      mensagem: 'Erro interno do servidos'
    })
  }
};

module.exports = { registro, login };
