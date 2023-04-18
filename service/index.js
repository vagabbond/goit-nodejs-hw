const Contact = require("./contact");

const listContacts = async (owner) => {
  const results = await Contact.find({ owner });
  return results;
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove(contactId);
};

const createContact = ({ body, owner }) => {
  return Contact.create({ ...body, owner });
};

const updateContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};
const updateStatusContact = (id, fields) => {
  return Contact.findByIdAndUpdate({ _id: id }, fields, { new: true });
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  createContact,
  updateContact,
  updateStatusContact,
};
