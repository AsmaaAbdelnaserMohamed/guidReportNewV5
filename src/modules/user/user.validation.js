// validation/auth.validation.js
import Joi from 'joi';

// التحقق من صحة بيانات التسجيل
export const validateRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(6).max(255).required(),
  });

  return schema.validate(data);
};

// التحقق من صحة بيانات تسجيل الدخول
// export const validateLogin = (data) => {
//   const schema = Joi.object({
//     username: Joi.string().min(3).max(255).required(),
//     password: Joi.string().min(6).max(255).required(),
//   });

//   return schema.validate(data);
// };
