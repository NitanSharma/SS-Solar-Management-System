const mongoose = require('mongoose')

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  address: { type: String },
  projectStatus: { type: String, required: true },
  capacityKW: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
