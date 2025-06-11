const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"],
    trim: true,
  },
  assignee: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: [true, "Due date is required"],
  },
  priority: {
    type: String,
    enum: ["P1", "P2", "P3", "P4"],
    default: "P3",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
