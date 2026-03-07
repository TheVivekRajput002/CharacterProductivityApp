const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const characterController = require("../controllers/character.controller")

const router = express.Router();

router.get("/", authMiddleware.authUserMiddleware, characterController.getCharacterStats)
router.post("/stats/increase", authMiddleware.authUserMiddleware, characterController.increaseStats)

module.exports = router;