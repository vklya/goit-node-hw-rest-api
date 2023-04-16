const express = require('express')

const ctrl = require('../../controllers/contacts-controllers')
const { validateBody } = require('../../utils')
const { schemas } = require('../../models/contact')

const router = express.Router();

router.get('/', ctrl.getAllContacts);
router.get('/:id', ctrl.getContact);
router.post('/', validateBody(schemas.addSchema), ctrl.postContact);
router.delete('/:id', ctrl.deleteContact);
router.put('/:id', validateBody(schemas.addSchema), ctrl.changeContact);
router.patch('/:id/favorite', validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router