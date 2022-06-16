const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'../uploads')
    },
    filename: (req, file, cb) => {
      const ext = file.originalname.split('.').pop()
        cb(null,`${Date.now()}.${ext}`)
    }
  }
)
const upload = multer({storage})

module.exports = upload

//app.post(`/upload`, upload.single('file'),(req, res) => {
//  res.send({data: 'Imagen creada'})
//})