const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../db/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const originalName = file.originalname
      .split(".")
      .slice(0, -1)
      .join("_");

    return {
      folder: "client_documents",
      public_id: `${Date.now()}-${originalName}`, // 👈 keeps name
      resource_type: "auto",
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
