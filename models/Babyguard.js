require('dotenv').config()
const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const babyguardSchema = new Schema({
    name: String,
    surnames: String,
    DNI: {
        type: String,
        unique: true
    },
    email:{
        type: String,
        unique: true
    },
    dias: Array,
    horario: String,
    disponible : Boolean,
    passwordHash:String,
    imgUrl: [{
        type: Schema.Types.ObjectId,
        ref:'Imagen'
    }]
})

babyguardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})

babyguardSchema.plugin(uniqueValidator)

const Babyguard = model('Babyguard', babyguardSchema)
 
module.exports = Babyguard