const express = require('express');
const { Tags } = require('../models');

const router = express.Router();

router.get('/' ,async (req, res) => {
  try {
    const { search } = req.query;
    const tags = await Tags.find({
      name: {
        $regex: search,
        $options: "i",
      },
    });

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

module.exports = router;