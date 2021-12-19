const { Schema, model } = require("mongoose");

const Tags = new Schema(
  {
    name: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = model("tag", Tags);