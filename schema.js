const Joi = require('joi');

module.exports.userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }).required().max(50),
    password: Joi.string().min(6).required(),
    userRole: Joi.string().valid('creater', 'buyer').required()
});



module.exports.contentSchema = Joi.object({
    type:Joi.string().required(),
    price:Joi.number().min(0),
    description:Joi.string(),
    url:Joi.string().required(),
    title:Joi.string().required(),
    publicId:Joi.string().required()

})