require('dotenv').config()
require('./mongo')
const express = require ('express')
const app = express()
const cors = require ('cors')
const logger = require('./loggerMiddlewhare')

const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Note = require('./models/Note')
//const Hijo = require('./models/Hijo')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userExtractor = require('./middleware/userExtractor')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


app.use(cors())
app.use(express.json())

app.use(logger) 

let notes = []
let hijos = []
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
    
    Note.findById(id)
    .then(note => {
        if (note){
            return response.json(note)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)   
    })
    
})

app.delete('/api/notes/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    // const note = await Note.findById(id)
    // if (!note) return response.sendStatus(404)
  
    const res = await Note.findByIdAndDelete(id)
    if (res === null) return response.sendStatus(404)
  
    response.status(204).end()
})

app.post('/api/notes', userExtractor, async (request, response, next) => {
    const {
      content,
      important = false
    } = request.body
  
    // sacar userId de request
    const { userId } = request
  
    const user = await User.findById(userId)
  
    if (!content) {
      return response.status(400).json({
        error: 'required "content" field is missing'
      })
    }
  
    const newNote = new Note({
      content,
      date: new Date(),
      important,
      user: user._id
    })
  
    // newNote.save().then(savedNote => {
    //   response.json(savedNote)
    // }).catch(err => next(err))
  
    try {
      const savedNote = await newNote.save()
  
      user.notes = user.notes.concat(savedNote._id)
      await user.save()
  
      response.json(savedNote)
    } catch (error) {
      next(error)
    }
})

app.put('/api/notes/:id', userExtractor, (request, response, next) => {
    const { id } = request.params
    const note = request.body
  
    const newNoteInfo = {
      content: note.content,
      important: note.important
    }
  
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })
//-------------------------MI APP------------------------------------

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
//app.use('api/users', hijosRouter)

app.use(notFound)
app.use(handleErrors) 




const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
