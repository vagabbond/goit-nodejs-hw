const express = require("express");

const router = express.Router();

const {
  validateAddData,
  validatePutData,
  validateFavoriteSchema,
} = require("../../midlwares/validator");
const isValidId = require("../../midlwares/isValidId");
const {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusControler,
} = require("../../controllers/controllers");

const authenticate = require("../../midlwares/authenticate");

router.get("/", authenticate, listContactsController);

router.get("/:contactId", authenticate, isValidId, getContactByIdController);

router.post("/", authenticate, validateAddData, addContactController);

router.delete("/:contactId", authenticate, isValidId, removeContactController);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validatePutData,
  updateContactController
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateFavoriteSchema,
  updateStatusControler
);
module.exports = router;
