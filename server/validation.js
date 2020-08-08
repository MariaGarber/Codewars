const Joi = require('@hapi/joi');

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .required()
      .pattern(/^[A-Z][a-z]+$/)
      .rule({ message: 'first name should contain only english lettrs a-z' }),
    lastName: Joi.string()
      .min(3)
      .required()
      .pattern(/^[A-Z][a-z]+$/)
      .rule({ message: 'last name should contain only english lettrs a-z' }),
    email: Joi.string().required().email(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .rule({
        message:
          'password field should contain only english lettrs and numbers (a-z, A-Z, 0-9)',
      }),
    startDate: Joi.string().required(),
    country: Joi.string().required(),
    gender: Joi.string().required(),
    level: Joi.string().required(),
    learn: Joi.string().required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),

    lastSeen: Joi.string().optional(),
  });
  return schema.validate(data);
};

const updateValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string(),
    firstName: Joi.string()
      .min(3)
      .optional()
      .allow('')
      .pattern(/^[A-Z][a-z]+$/)
      .rule({ message: 'first name should contain only english lettrs a-z' }),
    lastName: Joi.string()
      .min(3)
      .optional()
      .allow('')
      .pattern(/^[A-Z][a-z]+$/)
      .rule({ message: 'last name should contain only english lettrs a-z' }),
    newPassword: Joi.string()
      .min(6)
      .optional()
      .allow('')
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .rule({
        message:
          'new password should contain only english lettrs and numbers (a-z, A-Z, 0-9)',
      }),
    currentPassword: Joi.string().min(6).optional().allow(''),
    birthday: Joi.string().optional().allow(''),
    pic: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    gender: Joi.string().optional().allow(''),
  });
  return schema.validate(data);
};

const passValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string(),
    password: Joi.string()
      .min(6)
      .required()
      .pattern(/^[a-zA-Z0-9]{6,30}$/)
      .rule({
        message:
          'password field should contain only english lettrs and numbers (a-z, A-Z, 0-9)',
      }),
  });
  return schema.validate(data);
};

const contactValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .required()
      .pattern(/^[a-zA-Z]+([' '][a-zA-Z]+)*$/)
      .rule({ message: 'name should contain only english lettrs a-z' }),
    email: Joi.string().required().email(),
    description: Joi.string(),
  });
  return schema.validate(data);
};

const stringValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(),
    search: Joi.string()
      .required()
      .pattern(/^[a-zA-Z]+([' '][a-zA-Z]+)*$/),
  });
  return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.passValidation = passValidation;
module.exports.contactValidation = contactValidation;
module.exports.stringValidation = stringValidation;
