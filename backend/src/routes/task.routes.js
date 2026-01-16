const express = require("express");
const taskController = require("../controllers/task.controller");
const router = express.Router();
const {body} = require('express-validator');
const authMiddleware = require("../middleware/auth.middleware");

router.get("/getTasks/:clientId", authMiddleware.authAdmin, taskController.getTaskbyClientId);

router.post(
  "/addTask",
  authMiddleware.authAdmin,
  [
    body("clientId")
      .notEmpty()
      .withMessage("Client ID is required")
      .isMongoId()
      .withMessage("Invalid Client ID"),

    body("taskName")
      .notEmpty()
      .withMessage("Task name is required")
      .isLength({ min: 3 })
      .withMessage("Task name must be at least 3 characters"),

    body("date")
      .notEmpty()
      .withMessage("Date is required")
      .isISO8601()
      .withMessage("Invalid date format"),

    body("status")
      .optional()
      .isIn(["Pending", "Ongoing", "Completed"])
      .withMessage("Invalid status"),

    body("note")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Note must be under 500 characters"),
  ],
  taskController.addTask
);

router.get("/tasks/:id", authMiddleware.authAdmin, taskController.getTaskbyId);

router.put("/editTask/:id", authMiddleware.authAdmin, taskController.updateTask);

router.delete("/deleteTask/:id", authMiddleware.authAdmin, taskController.removeTask);

module.exports = router;
