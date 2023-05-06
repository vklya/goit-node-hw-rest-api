const { Schema, model } = require('mongoose');

const { handleMongooseError } = require('../helpers');

const userSchema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationCode: {
        type: String,
        required: [true, 'Verify code is required'],
    },
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = User;