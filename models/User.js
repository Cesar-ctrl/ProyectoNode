const { Schema, model } = require('mongoose')
const { appConfig } = require('../config')

const userSchema = new Schema({
    username: String,
    name: String,
    surnames: String,
    DNI: String,
    phone: Schema.Types.Number,
    email: String,
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

//userSchema.set('toJSON', {
//    transform: (document, returnedObject) => {
//        returnedObject.id = returnedObject._id
//        delete returnedObject._v
//
//        delete returnedObject.passwordHash
//    }
//})

userSchema.methods.setImgUrl = function setImgUrl (filename) {
    const { host, port } = appConfig
    this.imgUrl = `${host}:${port}/public/${filename}`
}

const User = model('User', userSchema)
 
module.exports = User