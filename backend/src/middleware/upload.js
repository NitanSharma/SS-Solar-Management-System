const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../db/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.');
    }

    const originalName = file.originalname
      .split(".")
      .slice(0, -1)
      .join("_");

    return {
      folder: "client_documents",
      public_id: `${Date.now()}-${originalName}`,
      resource_type:
        file.mimetype === "application/pdf" ? "raw" : "image",
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF are allowed.'), false);
    }
  },
});

module.exports = upload;
