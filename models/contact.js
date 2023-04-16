const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const contactSchema = Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, {versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongooseError);

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

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

const Contact = model('contacts', contactSchema)

module.exports = {
    schemas,
    Contact
}