require('dotenv').config()
const {model, Schema} = require('mongoose')

const imgSchema = new Schema ({
    lastModified: Schema.Types.Number,
    lastModifiedDate: Date,
    name: String,
    size: Schema.Types.Number,
    type: String,
    webkitRelativePath:String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

imgSchema.methods.setImgUrl = function setImgUrl (filename) {
    const { host, port } = appConfig
    this.imgUrl = `${host}:${port}/public/${filename}`
}


const Imagen = model('Imagen', imgSchema)


module.exports = Imagen