const express = require ('express')
const cors = require ('cors')
const multer = require('multer')
const app = express()
app.use(cors())

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

  app.post('/api/imgg', upload.single('file'), (request, response) => {
    const newImgInfo = new Imagen ({
      createdat: new Date(),
      updatedat: new Date()
    })
    response.send({ data: 'Imagen creada?'})
  
  })

const PORT = process.env.PORT || 3002
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }