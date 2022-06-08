const multer = require('multer')
const imagesRouter = require('express').Router()
const Imagen = require('../models/Imagen')

const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null,'./storage/imgs')
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
          cb(null,`${Date.now()}.${ext}`)
      }
  }
)
const upload = multer({storage})

imagesRouter.post(`/`, upload.single('file'),(req, res) => {
  res.send({data: 'Imagen creada'})
})

module.exports = imagesRouter