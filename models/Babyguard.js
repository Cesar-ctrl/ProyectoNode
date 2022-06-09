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
    phone: Schema.Types.Number,
    dias: Array,
    horarioinicio: String,
    horariofin: String,
    disponible : Boolean,
    passwordHash:String,
    descripcion:String
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