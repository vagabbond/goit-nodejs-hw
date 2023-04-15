const {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../service/index");

const listContactsController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await listContacts(owner);
    res.status(200).json(contacts);
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
    const { _id: owner } = req.user;
    const { body } = req;
    const contact = await createContact({ body, owner });
    return res.status(201).json(contact);
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
    const contact = await updateContact(contactId, body);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};
const updateStatusControler = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const contact = await updateStatusContact(contactId, { favorite });
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
  updateStatusControler,
};
