const yup = require('yup');

exports.userUpdate = yup.object().shape({
  firstName: yup.string().min(2).required(),
  lastName: yup.string().min(2).required(),
  location: yup.string(),
  avatarUrl: yup.string().url(),
  githubUrl: yup.string().url(),
  description: yup.string().min(3),
  work: yup.string().min(3),
  hobby: yup.string().min(3),
  birthDate: yup.date(),
});
