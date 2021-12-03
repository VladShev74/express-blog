const yup = require('yup');

exports.create = yup.object().shape({
  title: yup.string().required(),
});