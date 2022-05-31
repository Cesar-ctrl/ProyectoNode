require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require ('express')
const app = express()
const cors = require ('cors')
const logger = require('./loggerMiddlewhare')

const User = require('./models/User')
const Note = require('./models/Note')
//const Hijo = require('./models/Hijo')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userExtractor = require('./middleware/userExtractor')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const loginguardRouter = require('./controllers/login')
const hijosRouter = require('./controllers/hijos')
const babyguardsRouter = require('./controllers/babyguards')

app.use(cors())
app.use(express.json())

app.use(logger) 

let notes = []
let hijos = []


Sentry.init({
  dsn: 'https://ac034ebd99274911a8234148642e044c@o537348.ingest.sentry.io/5655435',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})


app.use(Sentry.Handlers.requestHandler())

app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  console.log(request.ip)
  console.log(request.ips)
  console.log(request.originalUrl)
  response.send('<h1>Hello World!</h1>')
})


app.get('/', (request, response) =>{
    Note.find({}).then(notes => {
      response.json(notes)
  })
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
app.use('/api/hijos', hijosRouter)
app.use('/api/loginguards', loginguardRouter)
app.use('/api/babyguards', babyguardsRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors) 




const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
