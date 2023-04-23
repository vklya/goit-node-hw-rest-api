const Joi = require('joi');

const userSchemaJoi = Joi.object({
    email: Joi.string().required().messages({
        "any.required": "missing required email field",
        "string.empty": "email field cannot be empty",
    }),
    password: Joi.string().required().min(6).messages({
        "any.required": "missing required password field",
        "string.empty": "password field cannot be empty",
        'string.min': `password should have a minimum of 6 symbols`,
    }),
});

const updateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required().messages({
        "any.required": "missing field subscription",
        "string.empty": "subscription field cannot be empty",
    }),
})

const userSchemasJoi = {
    userSchemaJoi,
    updateSubscriptionSchema,
};

module.exports = userSchemasJoi;