const { Schema, model, SchemaTypes } = require("mongoose");
const bcrypt = require("bcryptjs");

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    followers: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
    }],
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