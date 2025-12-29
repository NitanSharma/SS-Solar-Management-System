const Document = require("../models/Document");

exports.uploadDocuments = async (req, res) => {
  try {
    const { clientId } = req.body;
    console.log(req.body);
    if (!clientId) {
      return res.status(400).json({ message: "Client ID required" });
    }

    const files = req.files;

    const savedDocs = await Promise.all(
      files.map((file) =>
        Document.create({
          clientId,
          fileUrl: file.path,
          fileType: file.mimetype,
          originalName: file.originalname,
        })
      )
    );

    res.status(201).json({
      message: "Files uploaded successfully",
      files: savedDocs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDocumentsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;

    const docs = await Document.find({ clientId });

    if (!docs.length) {
      return res.status(404).json({ message: "No documents found" });
    }

    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
