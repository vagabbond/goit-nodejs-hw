const express = require("express");

const router = express.Router();

const {
  validateAddData,
  validatePutData,
  validateFavoriteSchema,
} = require("../../controllers/validator");

const {
  listContactsController,
  getContactByIdController,
  addContactController,
  removeContactController,
  updateContactController,
  updateStatusControler,
} = require("../../controllers/controllers");

router.get("/", listContactsController);

router.get("/:contactId", getContactByIdController);

router.post("/", validateAddData, addContactController);

router.delete("/:contactId", removeContactController);

router.put("/:contactId", validatePutData, updateContactController);

router.patch(
  "/:contactId/favorite",
  validateFavoriteSchema,
  updateStatusControler
);
module.exports = router;
