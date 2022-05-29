require('dotenv').config()
const {model, Schema} = require('mongoose')

const noteSchema = new Schema ({
    content: String,
    date: Date,
    important: Boolean,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject._v
    }
})

const Note = model('Note', noteSchema)

//Note.find({}).then(result => {
//    console.log(result)
//    mongoose.connection.close()
//})
//const note = new Note({
//    content: 'mongodb probando Schema',
//    date: new Date(),
//    important: true
//})
//
//note.save()
//    .then (result => {
//        console.log(result)
//        mongoose.connection.close()
//    }).catch(err => {
//        console.error(err)
//    })

module.exports = Note