require('dotenv').config()
const {model, Schema} = require('mongoose')

const hijoSchema = new Schema ({
    name: String,
    surnames: String,
    edad: Schema.Types.Number,
    dni: String,
    alergenos: Array,
    necesidadesesp:String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

hijoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Hijo = model('Hijo', hijoSchema)


module.exports = Hijo