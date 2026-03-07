const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["habit", "task", "goal"],
        default: "task"
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
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["completed", "archived", "in_progress"],
        default: "in_progress"
    },
    completed_at: {
  type: Date
}


},{ timestamps: true}

)

const taskModel = mongoose.model("Task", taskSchema);

module.exports = taskModel;