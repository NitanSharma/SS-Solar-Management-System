const express = require('express');
const Client = require('../models/client.model');
const { body, validationResult } =   require("express-validator");

const router = express.Router();

router.get("/clients", async (req, res) => {
  try {
    const clients = await Client.find({});
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

router.get("/getClient/:clientId", async (req, res) => {
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
});

router.post(
  "/addClient",
  [
    body("name")
      .isString()
      .withMessage("Name must be a string")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Invalid email address")
      .custom(async (email) => {
        // Check for unique email in the DB
        const existingClient = await Client.findOne({
          where: { email },
        });
        if (existingClient) {
          throw new Error("Email already exists");
        }
      }),

    body("contact")
      .isString()
      .withMessage("Contact must be a string")
      .notEmpty()
      .withMessage("Contact is required"),

    body("address")
      .optional()
      .isString()
      .withMessage("Address must be a string"),

    body("projectStatus")
      .isString()
      .withMessage("Project status must be a string"),

    body("capacityKW")
      .isFloat()
      .withMessage("Capacity must be a number (float)"),
  ],
  async (req, res) => {
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
);

module.exports = router;