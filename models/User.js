const { Schema, model } = require('mongoose')
const { appConfig } = require('../config')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
    name: String,
    surnames: String,
    DNI: {
        type: String,
        unique: true
    },
    phone: Schema.Types.Number,
    email: {
        type: String,
        unique: true
    },
    passwordHash: String,
    hijos: [{
        type: Schema.Types.ObjectId,
        ref:'Hijo'
    }],
    guards: [{
        type: Schema.Types.ObjectId,
        ref:'Babyguard'
    }],
    imgUrl: [{
        type: Schema.Types.ObjectId,
        ref:'Imagen'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)
 
module.exports = User