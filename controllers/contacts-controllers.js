const Contact = require('../models/contact');
const { ctrlWrapper } = require('../utils');
const { HttpError } = require('../helpers');

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  console.log(req.query)
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner}, '-createdAt -updatedAt', {skip, limit, favorite}).populate('owner', 'email');
  res.json(result);
}

const getContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id, '-createdAt -updatedAt');
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  };
  res.json(result);
}

const postContact = async (req, res) => {
  const {_id: owner} = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
}

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  };
  res.json({
    message: 'contact deleted',
  });
}

const changeContact = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw HttpError(404, `Contact with id ${id} not found`);
    };
    res.json(result);
}

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
  if (!result) {
    throw HttpError(404, `Contact with id ${id} not found`);
  };
  res.json(result);
}

module.exports = {
  getAllContacts: ctrlWrapper(getAllContacts),
  getContact: ctrlWrapper(getContact),
  postContact: ctrlWrapper(postContact),
  deleteContact: ctrlWrapper(deleteContact),
  changeContact: ctrlWrapper(changeContact),
  updateStatusContact: ctrlWrapper(updateStatusContact)
}