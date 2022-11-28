require('dotenv').config()
const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Modelo de Niñeras

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
    descripcion:String,
    imgUrl: String,
    chats: [{
        type: Schema.Types.ObjectId,
        ref:'User'
    }],
    cp:Schema.Types.Number
})

//Evito que devuelva la contraseña y algunos elementos más que son innecesarios
babyguardSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})

//El uniqueValidator evita que haya valores iguales en la base de datos lanzando un error
babyguardSchema.plugin(uniqueValidator)

const Babyguard = model('Babyguard', babyguardSchema)
 
module.exports = Babyguard