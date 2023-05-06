const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const jimp = require('jimp');
const shortid = require('shortid');

const User = require('../models/user');
const { ctrlWrapper } = require('../utils');
const { HttpError, sendMail } = require('../helpers');

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const signUp = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email in use");

    const avatarURL = gravatar.url(email);
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = shortid.generate();

    const result = await User.create({...req.body, password: hashedPassword, avatarURL, verificationCode});
    
    const verifyEmail = {
        to: email,
        subject: 'Verify mail',
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationCode}">Click to verify email</a>`
    }

    await sendMail(verifyEmail);

    res.status(201).json({
        email: result.email,
        subscription: result.subscription,
    })
}

const verify = async (req, res) => {
    const { verificationCode } = req.params;
    const user = await User.findOne({ verificationCode });
    if (!user) {
        throw HttpError(404, 'User not found');
    };
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: '' });

    res.json({
        message: 'Verification successful',
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, 'User not found');
    };
    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    };

    const verifyEmail = {
        to: email,
        subject: 'Verify mail',
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationCode}">Click to verify email</a>`
    }

    await sendMail(verifyEmail);

    res.json({
        message: 'Verification email sent',
    })    
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    };
    if (!user.verify) {
        throw HttpError(401, "Email is not verificated");
    };
    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) throw HttpError(401, "Email or password is wrong");
    
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
    await User.findByIdAndUpdate(user._id, { token });
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email,
        subscription,
    });
}

const logOut = async (req, res) => {
    const { _id } = req.user;
    
    await User.findByIdAndUpdate(_id, { token: null });
    res.status(204);
}

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, {new: true});
    if (!result) {
        throw HttpError(404, `User with id ${id} not found`);
    };
    res.json({
        email: result.email,
        subscription: result.subscription}
    );
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const image = await jimp.read(tempUpload);
    image.resize(250, 250);
    await image.writeAsync(tempUpload);
    const avatarName = `${_id}_${filename}`
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL });
}

module.exports = {
    signUp: ctrlWrapper(signUp),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    logOut: ctrlWrapper(logOut),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
}