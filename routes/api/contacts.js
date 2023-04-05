const express = require("express");

const router = express.Router();

const {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
} = require("../../controllers/controllers");
const {
  validateAddData,
  validatePutData,
} = require("../../controllers/validator");

router.get("/", listContactsController);

router.get("/:contactId", getContactByIdController);

router.post("/", validateAddData, addContactController);

router.delete("/:contactId", removeContactController);

router.put("/:contactId", validatePutData, updateContactController);

module.exports = router;
