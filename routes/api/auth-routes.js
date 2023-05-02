const express = require('express');

const router = express.Router();

const ctrl = require('../../controllers/auth-controllers')
const { validateBody } = require('../../utils');
const { userSchemasJoi } = require('../../utils');
const { authentificate, upload } = require('../../middlewares')
const { userSchemaJoi, updateSubscriptionSchema } = userSchemasJoi;

//registration
router.post('/register', validateBody(userSchemaJoi), ctrl.signUp);

//login
router.post('/login', validateBody(userSchemaJoi), ctrl.signIn);

//current
router.get('/current', authentificate, ctrl.getCurrent)

//logout
router.post('/logout', authentificate, ctrl.logOut);

//update subscription
router.patch('/subscription', authentificate, validateBody(updateSubscriptionSchema), ctrl.updateSubscription);

//update avatar
router.patch('/avatars', authentificate, upload.single('avatar'), ctrl.updateAvatar)

module.exports = router;