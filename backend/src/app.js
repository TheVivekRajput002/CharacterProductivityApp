const express = require("express");
const authRoutes = require("./routes/auth.router")
const cors = require("cors")

const app = express();

require("dotenv").config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true
// }))


app.get("/", (req, res) => {
    res.send("hello world")
})

app.use("/api/auth", authRoutes)

module.exports = app;