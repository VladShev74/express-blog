const yup = require('yup');

exports.commentCreate = yup.object().shape({
  text: yup.string().min(3).required(),
  parentPost: yup.string().required(),
  parentComment: yup.string(),
});

exports.commentUpdate = yup.object().shape({
  text: yup.string().min(2).required(),
});
