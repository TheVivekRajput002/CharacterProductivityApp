const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")

async function userRegister(req, res) {
    try {
        const { name, username, email, password } = req.body;
        console.log("Received email:", email);

        const isUserAlreadyExists = await userModel.findOne({ email })
        console.log("findOne result:", isUserAlreadyExists);

        if (isUserAlreadyExists) {
            console.log("user already exists");
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await userModel.create({
            name,
            username,
            email,
            password
        })

        res.status(200).json({
            message: "user created successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            }
        })
    } catch (error) {
        console.log("Error in registering the user!:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    userRegister
}

