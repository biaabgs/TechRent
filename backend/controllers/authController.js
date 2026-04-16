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
  // 1) TODO

const { nome, email, senha } = req.body; // extrai nome, email e senha do corpo da requisição

  if (!nome || !email || !senha) { // validação básica: verifica se nome, email e senha foram fornecidos
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
  }

  try {
    const [existeUsuario] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]); // verifica se já existe um usuário com o mesmo email
    if (existeUsuario.length > 0) { // se encontrar um usuário com o mesmo email, retorna erro
      return res.status(409).json({ mensagem: 'Email já registrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10); // criptografa a senha usando bcrypt (10 salt rounds)
    await db.execute('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senhaHash]); // insere o novo usuário no banco de dados
    return res.status(201).json({ mensagem: 'Usuário registrado com sucesso' }); // retorna sucesso 

  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }

  // res.json({ mensagem: 'registro - não implementado' });
};

//  =======================================================================
//  POST /auth/login - autentica e retorna JWT (token para fazer o registro)
//  =======================================================================

const login = async (req, res) => {
  // TODO

  const { email, senha } = req.body; // extrai email e senha do corpo da requisição

  if (!email || !senha) { // validação básica: verifica se email e senha foram fornecidos
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]); // consulta o usuário pelo email
    if (rows.length === 0) { // se não encontrar o usuário, retorna erro
      return res.status(401).json({ mensagem: 'Credenciais inválidas' });
    }

    const usuario = rows[0]; // pega o primeiro resultado (deve ser único)

    const senhaValida = await bcrypt.compare(senha, usuario.senha); // compara a senha fornecida com a senha armazenada (hash)
    if (!senhaValida) { // se a senha não for válida, retorna erro
      return res.status(401).json({ mensagem: 'Senha inválida' });
    }

    const token = jwt.sign(
      { // payload do token
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        nivel_acesso: usuario.nivel_acesso
      },
      process.env.JWT_SECRET, // chave secreta para assinar o token (deve ser definida no .env)
      { expiresIn: process.env.JWT_EXPIRES_IN } // tempo de expiração do token (definido no .env)
    );

    return res.json({ mensagem: 'Login realizado com sucesso', token }); // retorna o token para o cliente


  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ mensagem: 'Erro interno do servidor' });
  }

  // res.json({ mensagem: 'login - não implementado' });
};

module.exports = { registro, login };