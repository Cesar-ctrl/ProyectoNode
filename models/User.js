const { Schema, model } = require('mongoose')

const userSchema = new Schema({
    username: String,
    name: String,
    surnames: String,
    DNI: String,
//    phone: Int16Array,
    email: String,
    passwordHash:String,
    hijos: [{
        type: Schema.Types.ObjectId,
        ref:'Hijo'
    }],
    notes: [{
        type: Schema.Types.ObjectId,
        ref:'Note'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v

        delete returnedObject.passwordHash
    }
})
const User = model('User', userSchema)
 
module.exports = User