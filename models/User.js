const { Schema, model } = require('mongoose')
const { appConfig } = require('../config')
const uniqueValidator = require('mongoose-unique-validator')

//Modelo de Usuarios o Clientes

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
    imgUrl: String,
    chats: [{
        type: Schema.Types.ObjectId,
        ref:'Babyguard'
    }],
    contrato: {
        type: Schema.Types.ObjectId,
        ref:'Babyguard'
    },
    historialContratos: [{
        type: Schema.Types.ObjectId,
        ref:'Solicitud'
    }]
})
// Método con el que intenté inicialmente subir las imagenes
userSchema.methods,setImgUrl = function setImgUrl (filename){
    const {host, port} = appConfig
    this.imgUrl = `http://localhost:3001/public/${filename}`
}

//Evito que devuelva la contraseña y algunos elementos más que son innecesarios

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})
//El uniqueValidator evita que haya valores iguales en la base de datos lanzando un error
// En este casi todos los modelos que tienen uniqueValidator lo uso para el correo y el DNI
userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)
 
module.exports = User