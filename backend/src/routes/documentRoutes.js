const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadDocuments, getDocumentsByClient} = require("../controllers/documentController");

// Upload multiple files
router.post(
  "/upload",
  upload.array("files", 10),
  uploadDocuments
);

// Get files by clientId
router.get("/:clientId", getDocumentsByClient);

module.exports = router;
