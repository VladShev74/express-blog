const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { attachment } = require('express/lib/response');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.status(409).json({ message: "This username is already in use." });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    const payload = {
      _id: newUser._id,
    };

    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: newUser,
      token: jwToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await user.validPassword(req.body.password))) {
      res.status(400).json({ message: "invalid credentials" });
      return;
    }

    const payload = {
      _id: user._id,
    };

    const jwToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      user: user,
      token: jwToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.me = async (req, res) => {
  try {
    const existingUser = await User.findById(req.user._id)
    .populate('likedPosts')
    .populate('likedComments');
    if (!existingUser) {
      res.status(409).json({ message: "This user doesn't exist." });
      return;
    }
    res.json({
      user: existingUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
