import { create } from '../config/database';

class usuarioModel{
    static async criar(dadosUsuario){
    try{
        const senhaHash = await hashPassword(dadosUsuario.senha);

        const dadosComHash = {
            nome: dadosUsuario.nome,
            email: dadosUsuario.email,
            senha: senhaHash,
            
        }
    } catch{

    }
}

}

/* static async criar(dadosUsuario) {
        try {
            // Hash da senha antes de salvar
            const senhaHash = await hashPassword(dadosUsuario.senha);

            const dadosComHash = {
                nome_social: dadosUsuario.nome_social,
                email: dadosUsuario.email,
                cnpj: dadosUsuario.cnpj,
                telefone: dadosUsuario.telefone,
                senha_hash: senhaHash
            };

            return await create('usuarios', dadosComHash);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }
 */