const express = require('express');
const usersController = require('../controllers/users.controller');
const { schemaValidate, auth } = require('../middlewares');
const { userValidator } = require('../validationSchemas');

const router = express.Router();

router.put(
  '/:userId',
  auth,
  schemaValidate(userValidator.userUpdate),
  usersController.update
);

router.delete('/:userId', auth, usersController.delete);
router.get('/:userId', usersController.getById);
router.post('/:userId/follow', auth, usersController.follow);

module.exports = router;
