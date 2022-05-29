const mongoose = require('mongoose');
const {model, Schema} = mongoose

const connectionString = `mongodb+srv://amadocesar:zrO7cU3A8txfjUVW@cluster0.tpmtr.mongodb.net/midb?retryWrites=true&w=majority`    

mongoose.connect(connectionString)
    .then(() => {
        console.log('Database connected')
    }).catch(err => {
        console.error(err)
    })

const noteSchema = new Schema ({
    content: String,
    date: Date,
    important: Boolean
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