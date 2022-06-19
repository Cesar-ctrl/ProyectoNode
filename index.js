require('dotenv').config()
require('./mongo')
//const multer = require('multer');
//const GridFsStorage = require('multer-gridfs-storage');
//const Grid = require('gridfs-stream');

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require ('express')
const cors = require ('cors')
const multer = require('multer')
const app = express()
const path = require('path');
const socket = require('socket.io')
const User = require('./models/User')
const Note = require('./models/Note')
const Imagen = require('./models/Imagen')

const logger = require('./loggerMiddlewhare')

//const Hijo = require('./models/Hijo')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userExtractor = require('./middleware/userExtractor')

const imagesRouter = require('./controllers/subeimg')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const loginguardRouter = require('./controllers/loginguard')
const hijosRouter = require('./controllers/hijos')
const babyguardsRouter = require('./controllers/babyguards')
const messagesRouter = require('./controllers/messages')

app.use(cors())
app.use(express.json())

app.use(logger) 




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

const uploadsDir = path.resolve(__dirname, 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null,'./uploads')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null,`${Date.now()}.${ext}`)
  }
})
const upload = multer({ storage })


app.get('/', (request, response) => {
  console.log(request.ip)
  console.log(request.ips)
  console.log(request.originalUrl)
  response.send('<h1>Tu no metes cabras, saramambiche</h1>')
})


app.get('/', (request, response) =>{
    Note.find({}).then(notes => {
      response.json(notes)
  })
})

app.get('/api/notes', async (request, response) =>{
  const notes = await Note.find({}).populate('user', {
    username: 1,
    name: 1
  })
  response.json(notes)
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
app.use('/api/img/public', express.static(`${__dirname}/uploads`))

app.post('/api/img', upload.single('file'), async (request, response) => {
  console.log( request.file )
  const newImgInfo = new Imagen ({
    createdat: new Date(),
    updatedat: new Date()
  }) 
  const { filename } = request.file
  //const usuario = await User.findById(id)

  response.json(request.file)
})

//app.get('/api/img/:id', (request, response) => {
//  const { id } = request.params
//})

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/hijos', hijosRouter)
app.use('/api/loginguards', loginguardRouter)
app.use('/api/babyguards', babyguardsRouter)
app.use('/api/messages', messagesRouter)

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors) 

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});


module.exports = { app, server }