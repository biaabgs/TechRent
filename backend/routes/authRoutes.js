// =============================================
// ROTAS DE AUTENTICAÇÃO
// =============================================
// Rotas públicas — não exigem token JWT.

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/registro', authController.register);
router.post('/login', authController.login);

module.exports = router;