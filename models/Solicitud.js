require('dotenv').config()
const { Schema, model } = require('mongoose')
const { appConfig } = require('../config')

const solicitudSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    guard: {
        type: Schema.Types.ObjectId,
        ref:'Babyguard'
    },
    horarioinicio: String,
    horariofin: String,
    ninios: [{
        type: Schema.Types.ObjectId,
        ref:'Hijo'
    }],
    aprobado:Boolean,
    acabado:Boolean,
    colegio:Boolean,
    calle: String,
    institucion: String
})

solicitudSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v
    }
})

const Solicitud = model('Solicitud', solicitudSchema)

module.exports = Solicitud