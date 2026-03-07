const characterModel = require("../models/character.model");

async function createCharacter(req,res,user_id){

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

async function getCharacterStats(req,res){
const { userId: _id } = req.user

const response = await characterModel.findById()

}

module.exports = {
    getCharacterStats,
    createCharacter
}