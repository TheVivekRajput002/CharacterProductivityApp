const express = require("express");
const authRoutes = require("./routes/auth.router")
const taskRoutes = require("./routes/task.router")
const characterRoutes = require("./routes/character.router")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express();

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser());

app.get("", (req, res) => {
    res.send("hello world")
})

app.use("/api/auth", authRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/character", characterRoutes)

module.exports = app;