const express = require('express');
const { tagsControllers } = require('../controllers');

const router = express.Router();

router.get('/', tagsControllers.getTags);

module.exports = router;