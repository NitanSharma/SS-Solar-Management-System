const Client = require("../models/client.model");
const { validationResult } = require("express-validator");
const Task = require("../models/task.model");

const defaultTasks = [
  "Client Convince",
  "Rate",
  "Loan Cash",
  "Payment Received",
  "Document Received",
  "Portal Login",
  "Material Purchase: Structure",
  "Material Purchase: Panels and Inverter",
  "Material Purchase: BOS Material",
  "Material Purchase: Wiring, Earthing Set, and LA",
  "Installation: Structure",
  "Installation: Complete Installation",
  "Installer Payment",
  "File Preparation",
  "File Reached in Zone",
  "File Reached in Division",
  "Meter Conversion and SRFR",
  "Plant Start",
  "Working",
  "Service",
  "Complaint",
];

module.exports.getClient = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

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
};

module.exports.addClient = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const client = await Client.create(req.body);
    const tasks = defaultTasks.map((taskName, index) => ({
      client: client._id,
      taskName,
      status: "Pending",
      date: new Date(),
      note: "",
      order: index + 1, 
    }));
    await Task.insertMany(tasks);
    res.status(201).json({
      message: "Client created with default tasks",
      client,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
