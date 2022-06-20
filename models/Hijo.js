require('dotenv').config()
const {model, Schema} = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//Modelo de Niños

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

//Evito que devuelva algunos elementos que son innecesarios

hijoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._v
    }
})

//El uniqueValidator evita que haya valores iguales en la base de datos lanzando un error
hijoSchema.plugin(uniqueValidator)

const Hijo = model('Hijo', hijoSchema)


module.exports = Hijo