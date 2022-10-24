require('dotenv').config()
require('./mongo')

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

const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const userExtractor = require('./middleware/userExtractor')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const loginguardRouter = require('./controllers/loginguard')
const hijosRouter = require('./controllers/hijos')
const babyguardsRouter = require('./controllers/babyguards')
const messagesRouter = require('./controllers/messages')
const commentsRouter = require('./controllers/comments')
const solicitudesRouter = require('./controllers/solicitudes')

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
//Multer hace que sea fácil manipular este multipart/form-data cuando tus usuarios suben archivos.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null,'./uploads')
      // Indico donde se van a guardar las imagenes
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop()
    cb(null,`${Date.now()}.${ext}`)
    // Cambio el nombre del archivo para que no se repitan
  }
})
const upload = multer({ storage })

//A partir de aquí se llama a los controllers de la applicación 


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

//Para no tener todos los controladores en un mismo archivo los he separado 
//haciendo uso de .use especifico las rutas y el Router de cada uno

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/hijos', hijosRouter)
app.use('/api/loginguards', loginguardRouter)
app.use('/api/babyguards', babyguardsRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/solicitudes', solicitudesRouter)


// Aquí  se llaman a los middlewares de control de errores

app.use(notFound)
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors) 


//Se hace levanta el servidor, hay que especificar el puerto
const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//Socket.IO es una biblioteca de JavaScript basada en eventos para aplicaciones web en tiempo real.
//La voy a utilizar para que el chat sea a tiempo real
//Si se quiere probar en local
// Cambiar origin: "https://babyguard.vercel.app" por origin: "http://localhost:3000"
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