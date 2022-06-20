require('dotenv').config()
const {model, Schema} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const hijoSchema = new Schema ({
    name: String,
    surnames: String,
    edad: Schema.Types.Number,
    DNI: {
        type: String,
        unique: true
    },
    alergenos: Array,
    necesidadesesp:String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    imgUrl: String
})

hijoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v
    }
})

hijoSchema.plugin(uniqueValidator)

const Hijo = model('Hijo', hijoSchema)


module.exports = Hijo