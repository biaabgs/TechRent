const bcrypt = require('bcrypt');
const UserModel = require('../model/usuarioModel');
const { generateJWT } = require('../config/jwt');


class AuthController {

  static async register(req, res) {
    const { nome, email, senhaSemHash, nivel_acesso } = req.body;

    if (!nome || !email || !senhaSemHash || !nivel_acesso) {
      return res.status(400).json({ error: "Campos faltando para o registro!" });
    };

    try {
      if (nome.length < 3) {
        return res.status(400).json({ error: "Nome inválido!" });
      }

      if (!/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm.test(email)) {
        return res.status(400).json({ error: "Email inválido!" });
      };

      if (!/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(senhaSemHash)) {
        return res.status(400).json({ error: "Senha inválida!" });
      };

      if (nivel_acesso != 'cliente' && nivel_acesso != 'admin' && nivel_acesso != 'tecnico') {
        return res.status(400).json({ error: "Nivel de acesso inválido!" });
      };

      const senha = await bcrypt.hash(senhaSemHash, 10);

      const novaConta = await UserModel.criar({ nome, email, senha, nivel_acesso: nivel_acesso || "cliente" });

      return res.status(201).json({ ok: true, mensagem: "Usuario criado com sucesso!", novaContaId: novaConta});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    };
  };

  static async login(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ error: "Campos faltando para login!" });
    };
    try {
      const userExists = await UserModel.buscarPorEmail(email);
      if (!userExists) {
        return res.status(404).json({ error: "Credenciais inválidas!" });
      };

      const senhaValida = await bcrypt.compare(senha, userExists.senha);
      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas!" });
      };

      const { senha: _, ...usuarioSemSenha } = userExists;

      const token = generateJWT({id: userExists.id, nome: userExists.nome, email: userExists.email, nivel_acesso: userExists.nivel_acesso});

      return res.status(200).json({ ok: true, mensagem: "Usuario logado com sucesso!", usuario: usuarioSemSenha, token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor!" });
    }
  }
}

module.exports = AuthController;