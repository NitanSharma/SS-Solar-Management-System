const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadDocuments, getDocumentsByClient} = require("../controllers/documentController");
const authMiddleware = require("../middleware/auth.middleware");

// Upload multiple files
router.post(
  "/upload",
  authMiddleware.authAdmin,
  upload.array("files", 10),
  uploadDocuments
);

// Get files by clientId
router.get("/:clientId", authMiddleware.authAdmin, getDocumentsByClient);

module.exports = router;
