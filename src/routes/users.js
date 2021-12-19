const express = require('express');
const usersController = require('../controllers/users.controller');
const { schemaValidate } = require('../middlewares');
const { userValidator } = require('../validationSchemas');

const router = express.Router()

router.put('/:usersId', schemaValidate(userValidator.userUpdate), usersController.update)

router.get('/:usersId', usersController.delete)
router.get('/:userId', usersController.getById);
router.post('/:userId/follow', usersController.follow);

module.exports = router;