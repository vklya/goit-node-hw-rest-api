const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { ctrlWrapper } = require('../utils');
const { HttpError } = require('../helpers');

const { SECRET_KEY } = process.env;

const signUp = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) throw HttpError(409, "Email in use");
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const result = await User.create({...req.body, password: hashedPassword});
    
    res.status(201).json({
        email: result.email,
        subscription: result.subscription,
    })
}

const signIn = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw HttpError(401, "Email or password is wrong");
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
    console.log(req.user)
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

module.exports = {
    signUp: ctrlWrapper(signUp),
    signIn: ctrlWrapper(signIn),
    getCurrent: ctrlWrapper(getCurrent),
    logOut: ctrlWrapper(logOut),
    updateSubscription: ctrlWrapper(updateSubscription),
}