const express = require('express')

const ctrl = require('../../controllers/contacts-controllers')
const { validateBody } = require('../../utils')
const { contactSchemasJoi } = require('../../utils')
const { isValidId, authentificate } = require('../../middlewares');
const { addSchema, updateFavoriteSchema } = contactSchemasJoi;

const router = express.Router();

router.get('/', authentificate, ctrl.getAllContacts);
router.get('/:id', authentificate, isValidId, ctrl.getContact);
router.post('/', authentificate, validateBody(addSchema), ctrl.postContact);
router.delete('/:id', authentificate, isValidId, ctrl.deleteContact);
router.put('/:id', authentificate, isValidId, validateBody(addSchema), ctrl.changeContact);
router.patch('/:id/favorite', authentificate, isValidId, validateBody(updateFavoriteSchema), ctrl.updateStatusContact);

module.exports = router