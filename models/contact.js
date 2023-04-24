const { Schema, model } = require('mongoose');

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
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongooseError);

const Contact = model('contacts', contactSchema)

module.exports = Contact;