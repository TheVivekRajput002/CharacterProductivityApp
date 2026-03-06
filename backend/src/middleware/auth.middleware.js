const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "you are not logged in!!",
            isLoggedIn: false
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        req.user = user

        next()

    } catch (error) {
        return res.status(401).json({
            message: "invalid token!!",
            isloggedIn: false
        })
    }
}

module.exports = {
    authUserMiddleware
}

