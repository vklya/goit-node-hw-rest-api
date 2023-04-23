const Joi = require('joi');

const addSchema = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "missing required name field",
        "string.empty": "name field cannot be empty",
    }),
    email: Joi.string().required().messages({
        "any.required": "missing required email field",
        "string.empty": "email field cannot be empty",
    }),
    phone: Joi.string().required().messages({
        "any.required": "missing required phone field",
        "string.empty": "phone field cannot be empty",
    }),
    favorite: Joi.boolean(),
})

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required().messages({
        "any.required": "missing field favorite"
    }),
})

const contactSchemasJoi = {
    addSchema,
    updateFavoriteSchema,
}

module.exports = contactSchemasJoi;