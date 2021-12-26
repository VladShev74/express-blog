const yup = require('yup');

exports.authRegister = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(6).required(),
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(2).required(),
  location: yup.string(),
  avatarUrl: yup.string().url(),
  githubUrl: yup.string().url().optional(),
  description: yup.string().optional(),
  work: yup.string().optional(),
  hobby: yup.string().optional(),
  birthDate: yup.date(),
});

exports.authLogin = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(6).required(),
});
