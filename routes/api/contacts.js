const express = require('express')
const Joi = require('joi');

const contacts = require('../../models/contacts');

const {HttpError} = require('../../helpers');

const router = express.Router();

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
})

router.get('/', async (_, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  }
  catch(error) {
    next(error);
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.getContactById(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} not found`);
    };
    res.json(result);
  }
  catch(error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) throw HttpError(400, error.message);
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  }
  catch(error) {
    next(error);
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contacts.removeContact(id);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} not found`);
    };
    res.json({
      message: 'contact deleted',
    });
  }
  catch(error) {
    next(error);
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) throw HttpError(400, 'missing fields');
    const { id } = req.params;
    const result = await contacts.updateContact(id, req.body);
    if (!result) {
      throw HttpError(404, `Contact with id ${id} not found`);
    };
    res.json(result);
  }
  catch(error) {
    next(error);
  }
})

module.exports = router
