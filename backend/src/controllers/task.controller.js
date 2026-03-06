const taskModel = require("../models/task.model")

async function createTask(req, res) {
    const { _id: userId } = req.user
    const { title, tag, priority, due_date } = req.body

    const task = await taskModel.create({
        user_id: userId,
        title,
        type: task,
        tag,
        priority,
        due_date,
    })

}

module.exports = {
    createTask
}