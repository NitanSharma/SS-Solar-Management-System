const express = require("express");
const Client = require("../models/client.model");
const { body } = require("express-validator");
const clientController = require("../controllers/client.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/clients", authMiddleware.authAdmin, clientController.getClient);

router.get("/getClient/:clientId", authMiddleware.authAdmin, clientController.getClientbyId);

router.post(
  "/addClient",
  authMiddleware.authAdmin,
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
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
          throw new Error("Email already exists");
        }
      }),

    body("contact")
      .notEmpty()
      .withMessage("Contact is required")
      .isNumeric()
      .withMessage("Contact must be a number")
      .isLength({ min: 10, max: 10 })
      .withMessage("Contact must be 10 digits"),

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
  clientController.addClient
);

module.exports = router;
