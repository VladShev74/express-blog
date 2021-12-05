const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    username: {
      type: String,
      minlength: 2,
      required: true,
      unique: true
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
    firstName: {
      type: String,
      minlength: 2,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 2,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    avatarUrl: {
      type: String,
      required: false,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    },
    githubUrl: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      minlength: 3,
      required: false,
    },
    work: {
      type: String,
      minlength: 3,
      required: false,
    },
    hobby: {
      type: String,
      minlength: 3,
      required: false,
    },
  },
  { timestamps: true }
);

User.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

User.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("user", User);