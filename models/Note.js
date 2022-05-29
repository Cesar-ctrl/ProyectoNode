require('dotenv').config()
require('./mongo')

const noteSchema = new Schema ({
    content: String,
    date: Date,
    important: Boolean
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