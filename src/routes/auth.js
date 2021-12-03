const express = require('express');
const { auth } = require('../middlewares');
const { authControllers } = require('../controllers');

const router = express.Router();

router.post('/register', authControllers.register);

router.post('/login', authControllers.login);

router.get('/me', auth, authControllers.me);

module.exports = router;