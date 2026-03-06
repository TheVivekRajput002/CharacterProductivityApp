const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const taskController = require("../controllers/task.controller")

const router = express.Router();

router.post("/create", authMiddleware.authUserMiddleware, taskController.createTask )

module.exports = router;