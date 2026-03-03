const userModel = require("../models/user.model")

async function userRegister(req, res) {
    const { name, username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        console.log("user already exists");
        return res.status(400).json({ message: "user already exists" });
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

}

module.exports = {
    userRegister
}

