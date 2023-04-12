const Contact = require("./contact");

const listContacts = async () => {
  const results = await Contact.find({});
  return results;
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove(contactId);
};

const createContact = ({ phone, name, email }) => {
  return Contact.create({ phone, name, email });
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
