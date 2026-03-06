const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["habit", "task", "goal"],
        default: "task"
    },
    status: {
        type: String,
        enum: ["completed", "archived", "in_progress"],
        default: "in_progress"
    },
    tag: {
        type: String,
        enum: ["health", "intelligence", "strength", "creativity"],
        default: "health"
    },
    priority: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    progress: {
        type: Number,
        default: 0
    },
    target: {
        type: Number,
    },
    frequency: {
        type: Number,
    },
    due_date: {
        type: Number,
        required: true,
    },


},{ timestamps: true}

)

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;