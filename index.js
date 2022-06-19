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
    origin: "https://babyguard.vercel.app",
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