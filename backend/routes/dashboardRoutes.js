// =============================================
// ROTAS DE DASHBOARD
// =============================================

const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middlewares/auth');
const DashboardController = require('../controllers/dashboardController');
const UsuarioController = require('../controllers/usuarioController');

router.get('/admin', autenticar, autorizar('admin'), DashboardController.viewAdmin);
router.get('/tecnico', autenticar, autorizar('admin', 'tecnico'), DashboardController.viewTecnico);
router.get('/cliente', autenticar, autorizar('cliente', 'admin'), DashboardController.viewCliente);

router.put('/admin/usuarios/:id', UsuarioController.atualizar);
router.delete('/admin/usuarios/:id', UsuarioController.deletar);

module.exports = router;