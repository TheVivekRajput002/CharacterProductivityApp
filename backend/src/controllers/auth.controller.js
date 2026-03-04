const userModel = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

async function userRegister(req, res) {
    try {
        const { name, username, email, password } = req.body;
        console.log("Received email:", email);

        const isUserAlreadyExists = await userModel.findOne({ email })
        console.log("findOne result:", isUserAlreadyExists);

        if (isUserAlreadyExists) {
            console.log("user already exists");
            return res.status(200).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            username,
            email,
            password: hashedPassword
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.cookie("token", token)

        res.status(200).json({
            message: "User created successfully",
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

async function userLogin(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(200).json({ message: "invalid email or password" })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        return res.status(200).json({
            message: "invalid email or password"
        })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.cookie("token", token)

    res.status(200).json({
        message: "Logged in successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}

async function userDetails(req, res) {
    res.status(200).json({
        message: "you are loggedin",
        isLoggedIn: true,
        user: req.user,
    })
}

module.exports = {
    userRegister,
    userLogin,
    userDetails
}

