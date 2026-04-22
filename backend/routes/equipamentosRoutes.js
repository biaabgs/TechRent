// =============================================
// ROTAS DE EQUIPAMENTOS
// =============================================
// Todas as rotas aqui exigem autenticação (autenticar).
// Algumas exigem nível de acesso específico (autorizar).

const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const EquipamentoController = require('../controllers/equipamentosController');

router.get('/', autenticar, EquipamentoController.listFunctioning);
router.get('/todos', autenticar, autorizar('admin'), EquipamentoController.listAll);
router.get('/:id', autenticar, EquipamentoController.findById);

router.post('/', autenticar, autorizar('admin'), EquipamentoController.create);
router.put('/:id', autenticar, autorizar('admin'), EquipamentoController.update);
router.put('/:id/status', autenticar, autorizar('admin','tecnico'), EquipamentoController.updateStatus)
router.delete('/:id', autenticar, autorizar('admin'), EquipamentoController.delete);

module.exports = router;
