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
        res.status(400).json({
            message: "brother there is some error",
            error
        })
    }

}

async function getTasks(req,res){
    const userId = req.user._id

    try {
        
        const tasks = await taskModel.find({user_id: userId})
    
        res.status(200).json({
            message: "here are all the tasks",
            tasks
        })

    } catch (error) {
        res.status(400).json({
            message: "brother there is some error",
            error
        })
    }

}

async function completeTask(req,res){
    const { taskId } = req.body

    try {
        
        const task = await taskModel.findByIdAndUpdate(taskId, {
            status: "completed",
            completed_at: new Date()
        })
    
        res.status(200).json({
            message: "task completed successfully",
            updatedData: {
                status: task.status,
                completed_at: task.completed_at
            }           
        })
    } catch (error) {
        res.status(400).json({
            message: "brpther here is some error",
            error
        })
    }

}

module.exports = {
    createTask,
    getTasks,
    completeTask
}