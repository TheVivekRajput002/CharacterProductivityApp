const characterModel = require("../models/character.model");

async function createCharacter(req, res, user_id) {

    try {
        const character = await characterModel.create({
            user_id
        })

        return character;
    } catch (error) {
        console.error("there is a error brother", error)
        throw error;
    }

}

async function getCharacterStats(req, res) {
    const { _id: userId } = req.user

    try {        
        const character = await characterModel.findOne({user_id: userId})
    
        res.status(200).json({
            message: "here are character details",
            character
        })

    } catch (error) {
        res.status(200).json({
            message: "there is  some error brother",
            error
        })
        
    }


}

module.exports = {
    getCharacterStats,
    createCharacter
}