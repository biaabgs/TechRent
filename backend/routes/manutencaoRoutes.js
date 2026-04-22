// =============================================
// ROTAS DE MANUTENÇÃO
// =============================================

const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const ManutencaoController = require('../controllers/manutencaoController');

router.get('/', autenticar, autorizar('admin', 'tecnico'), ManutencaoController.list);
router.post('/', autenticar, autorizar('admin','tecnico'), ManutencaoController.register);
router.put('/:id', autenticar, autorizar('admin', 'tecnico'), ManutencaoController.updateDescription);

module.exports = router;
