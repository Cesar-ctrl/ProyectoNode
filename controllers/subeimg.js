const multer = require('multer')
const imagesRouter = require('express').Router()
const Imagen = require('../models/Imagen')
const userExtractor = require('../middleware/userExtractor')


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

imagesRouter.post(`/`,userExtractor , upload.single('file'), async(request, response, next) => {
  const newImgInfo = new Imagen ({
    createdat: new Date(),
    updatedat: new Date()
  })

  const{ filename } = request.filenewImgInfo.setImgUrl(filename)

  try{
    const savedImg = await newImgInfo.save()
    response.json(savedImg)
  }catch(e){
    next(e)
  }
})

module.exports = imagesRouter