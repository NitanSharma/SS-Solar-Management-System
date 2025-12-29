const express = require("express");
const taskController = require("../controllers/task.controller");
const router = express.Router();
const {body} = require('express-validator');

router.get("/getTasks/:clientId", taskController.getTaskbyClientId);

router.post(
  "/addTask",
  // [
  //   body("clientId")
  //     .notEmpty()
  //     .withMessage("Client ID is required")
  //     .isMongoId()
  //     .withMessage("Invalid Client ID"),

  //   body("taskName")
  //     .notEmpty()
  //     .withMessage("Task name is required")
  //     .isLength({ min: 3 })
  //     .withMessage("Task name must be at least 3 characters"),

  //   body("date")
  //     .notEmpty()
  //     .withMessage("Date is required")
  //     .withMessage("Invalid date format"),

  //   body("status")
  //     .optional()
  //     .isIn(["pending", "completed", "in-progress"])
  //     .withMessage("Invalid status"),

  //   body("note")
  //     .optional()
  //     .isLength({ max: 500 })
  //     .withMessage("Note must be under 500 characters"),
  // ],
  taskController.addTask
);

router.get("/tasks/:id", taskController.getTaskbyId);

router.put("/editTask/:id", taskController.updateTask);

router.delete("/deleteTask/:id", taskController.removeTask);

module.exports = router;
