const { Schema, model } = require('mongoose')

const babyguardSchema = new Schema({
    name: String,
    surnames: String,
    DNI: String,
    email: String,
    dias: String,
    horario: String,
    disponible : Boolean,
    passwordHash:String
})

babyguardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})
const Babyguard = model('Babyguard', babyguardSchema)
 
module.exports = Babyguard