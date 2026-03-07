const mongoose = require("mongoose");

const characterSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    level: {
        type: Number,
        default: 1
    },
    xp: {
        type: Number,
        default: 0
    },
    stats: {
        health: { type: Number, default: 20 },
        intelligence: { type: Number, default: 20 },
        creativity: { type: Number, default: 20 },
        discipline: { type: Number, default: 20 }
    }
}, {
    timestamps: true
});

const characterModel = mongoose.model("character", characterSchema);

module.exports = characterModel;