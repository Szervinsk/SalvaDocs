const express = require('express');
const router = express.Router();
const Controller = require('../controllers/controller');

// Rota de teste
router.get('/', Controller.home);
router.get('/pastas', Controller.pastas);

module.exports = router;
