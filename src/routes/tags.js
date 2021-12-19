const express = require('express');
const { tagsControllers } = require('../controllers');
const { schemaValidate } = require('../middlewares');

const router = express.Router();

router.get('/', tagsControllers.getTags);

module.exports = router;