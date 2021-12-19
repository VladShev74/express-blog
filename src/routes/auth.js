const express = require('express');
const { auth } = require('../middlewares');
const { authControllers } = require('../controllers');
const { schemaValidate } = require('../middlewares');
const { authValidator } = require('../validationSchemas');

const router = express.Router();

router.post('/register', schemaValidate(authValidator.authRegister), authControllers.register);

router.post('/login', schemaValidate(authValidator.authLogin), authControllers.login);

router.get('/me', auth, authControllers.me);

module.exports = router;