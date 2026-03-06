const taskModel = require("../models/task.model")

async function createTask(req, res) {
    const { _id: userId } = req.user
    const { title, tag, priority, due_date } = req.body

    try {
        
        const task = await taskModel.create({
            user_id: userId,
            title,
            type: "task", // defaulting to "task" string
            tag,
            priority,
            due_date,
        })
    
        res.status(200).json({
            message: "task created successfully",
            task
        })

    } catch (error) {
        res.status(200).json({
            message: "brother there is some error",
            error
        })
    }

}

module.exports = {
    createTask
}