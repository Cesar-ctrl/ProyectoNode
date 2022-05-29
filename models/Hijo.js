require('dotenv').config()
const {model, Schema} = require('mongoose')

const hijoSchema = new Schema ({
    content: String,
    date: Date,
    important: Boolean,
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

//Hijo.find({}).then(result => {
//    console.log(result)
//    mongoose.connection.close()
//})
//const hijo = new Hijo({
//    content: 'mongodb probando Schema',
//    date: new Date(),
//    important: true
//})
//
//Hijo.save()
//    .then (result => {
//        console.log(result)
//        mongoose.connection.close()
//    }).catch(err => {
//        console.error(err)
//    })

module.exports = Hijo