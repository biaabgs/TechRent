// =============================================
// ROTAS DE CHAMADOS
// =============================================

const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const ChamadaController = require('../controllers/chamadosController');

router.get('/', autenticar, ChamadaController.list);
router.get('/:id', autenticar, ChamadaController.findById);
router.post('/', autenticar, autorizar('cliente', 'admin'), ChamadaController.create);
router.put('/:id/status', autenticar, autorizar('tecnico', 'admin'), ChamadaController.updateStatus);

module.exports = router;