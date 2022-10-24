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
    aprobado:Boolean,
    acabado:Boolean
})

solicitudSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v
    }
})

const Solicitud = model('Solicitud', solicitudSchema)

module.exports = Solicitud