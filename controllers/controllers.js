const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const listContactsController = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json([...contacts]);
  } catch (error) {
    next(error);
  }
};

const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const addContactController = async (req, res, next) => {
  try {
    const { body } = req;
    if (!body.name || !body.email || !body.phone) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const contact = await addContact(body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;
    if (!body) {
      return res.status(400).json({ message: "missing fields" });
    }
    const contact = await updateContact(contactId, body);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
};
