const Client = require('../models/client.model');
const {validationResult } =   require("express-validator");

module.exports.getClient = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
}

module.exports.getClientbyId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
}

module.exports.addClient = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const client = await Client.create(req.body);
      res.status(201).json(client);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
}