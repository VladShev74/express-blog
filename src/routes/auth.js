const express = require('express');
const { auth } = require('../middlewares');
const { authControllers } = require('../controllers');
const { schemaValidate } = require('../middlewares');

const router = express.Router();

router.post('/register', schemaValidate(authRegister), authControllers.register);

router.post('/login', schemaValidate(authLogin), authControllers.login);

router.get('/me', auth, authControllers.me);

module.exports = router;