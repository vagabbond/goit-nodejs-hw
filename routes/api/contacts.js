const express = require("express");

const router = express.Router();

const {
  validateAddData,
  validatePutData,
  validateFavoriteSchema,
} = require("../../controllers/validator");
const isValidId = require("../../controllers/isValidId");
const {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusControler,
} = require("../../controllers/controllers");

router.get("/", listContactsController);

router.get("/:contactId", isValidId, getContactByIdController);

router.post("/", validateAddData, addContactController);

router.delete("/:contactId", isValidId, removeContactController);

router.put("/:contactId", isValidId, validatePutData, updateContactController);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateFavoriteSchema,
  updateStatusControler
);
module.exports = router;
