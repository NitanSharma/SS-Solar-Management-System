const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",   // reference to Client collection
    required: true
  },
    taskName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Ongoing", "Completed"], 
      default: "Pending",
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
