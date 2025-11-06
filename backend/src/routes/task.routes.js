const express = require('express');
const Task = require('../models/task.model');
const Client = require('../models/client.model');
const router = express.Router();

router.get("/getTasks/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    // 🔸 Validate clientId
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required." });
    }

    // 🔸 Fetch tasks that belong to this client, sorted oldest → newest
    const tasks = await Task.find({ client: clientId }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Tasks fetched successfully!",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addTask", async (req, res) => {
  try {
    const { clientId, taskName, status, date, note } = req.body;

    if (!clientId || !taskName || !date) {
      return res.status(400).json({ message: "Client ID, Task Name, and Date are required." });
    }

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found." });
    }

    const newTask = new Task({
      client: clientId, // reference to client
      taskName,
      status,
      date,
      note,
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task added successfully!",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.json({ task });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

router.put("/editTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { taskName, status, date, note } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { taskName, status, date, note },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task updated successfully!",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({
      message: "Task deleted successfully!",
      deletedTask,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;