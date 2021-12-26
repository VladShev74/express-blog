const { Schema, model, SchemaTypes } = require("mongoose");
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
      required: false,
    },
    work: {
      type: String,
      required: false,
    },
    hobby: {
      type: String,
      required: false,
    },
    birthDate: {
      type: Date,
    },
    following: [{
      type: Schema.Types.ObjectId,
      ref: 'user'
    }],
    followers: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
    }],
    readingList: [{
      type: Schema.Types.ObjectId,
      ref: 'post'
    }],
    likedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'post'
    }],
    likedComments: [{
      type: Schema.Types.ObjectId,
      ref: 'comment'
    }],
    posts: [{
      type: Schema.Types.ObjectId,
      ref: 'post'
    }],
  },
  
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

User.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

User.methods.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = model("user", User);