const multer = require('multer')
const imagesRouter = require('express').Router()
const Imagen = require('../models/Imagen')
const userExtractor = require('../middleware/userExtractor')


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./storage')
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop()
      cb(null,`${Date.now()}.${ext}`)
    }
})
const upload = multer({ storage })

imagesRouter.post(`/api/img`,userExtractor , upload.single('file'), (request, response) => {
  console.log(request)
  const newImgInfo = new Imagen ({
    createdat: new Date(),
    updatedat: new Date()
  })
  response.send({ data: 'Imagen creada?'})

})

module.exports = imagesRouter