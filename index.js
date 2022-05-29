require('./mongo')
const express = require ('express')
const app = express()
const cors = require ('cors')
const logger = require('./loggerMiddlewhare')

const Note = require('./models/Note')

app.use(cors())
app.use(express.json())

app.use(logger) 

let notes = []
//const app = http.createServer((request, response) => {
//    response.writeHead(200, {'Content-Type': 'application/json'})
//    response.end(JSON.stringify(notes))
//})


app.get('/', (request, response) =>{
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) =>{
    Note.find({}).then(notes => {
        response.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) =>{
    const { id } = request.params
    
    Note.findById(id).then(note => {
        if (note){
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)   
    })
    
})

app.delete('/api/notes/:id', (request, response, next) =>{
    const { id } = request.params
    Note.findByIdAndRemove(id).then(result => {
        response.status(204).end()
    }).catch(error => next(error))
})

app.post('/api/notes', (request, response) =>{
    const note  = request.body
    
    if (!note.content){
        return response.status(400).json({
            error:'note.content is missing'
        })
    }

    const newNote = new Note({
        content: note.content,
        date: new Date(),
        important: note.important || false
    })
    newNote.save().then(savedNote => {
        response.json(savedNote)
    })
    //notes = [...notes, newNote]
    response.status(201).json(newNote)
})

app.put('/api/notes/:id', (request, response, next) =>{
    const { id } = request.params
    const note = request.body

    const newNoteInfo = {
        content: note.content,
        important: note.important
    }

    Note.findByIdAndUpdate(id, newNoteInfo, {new:true})
        .then(result => {
            response.json(result)
        }).catch(error => next(error))
})

app.use((error, request, response, next)=> {
    response.status(404).end()
})

app.use((error, request, response, next)=> {
    console.error(error)

    if (error.name === 'CastError'){
        response.status(400).send({ error: 'is used is malformed' })
    } else {
        response.status(500)
    }
 
}) 




const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
