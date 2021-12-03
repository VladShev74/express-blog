const express = require('express');
const { Tags } = require('../models');
const { schemaValidate } = require("../middlewares");
const { tagsValidator } = require("../validationSchemas");

const router = express.Router();

router.get('/tags' ,async (req, res) => {
  try {
    const tags = await Tags.find({
      title: {
        $regex: search,
        $options: "i",
      },
    });

    res.json({
      tags
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Created POST route for testing
router.post('/tags', schemaValidate(tagsValidator.create), async (req, res) => {
  try {
    const newTag = await Tags.create({
      name: req.body.name,
    });
    res.json(newTag);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;