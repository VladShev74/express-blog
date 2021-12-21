const yup = require('yup');

exports.postCreate = yup.object().shape({
  thumbnailUrl: yup.string().url(),
  title: yup.string().min(3).required(),
  body: yup.string().min(10).required(),
  tags: yup.string(),
});

exports.postUpdate = yup.object().shape({
  thumbnailUrl: yup.string().url(),
  title: yup.string().min(3).required(),
  body: yup.string().min(10).required(),
  tags: yup.string(),
});
