const  {model, Schema, mongoose} = require("mongoose");

//Modelo de Comentarios

const CommentSchema = mongoose.Schema({
    valoracion: Schema.Types.Number,
    contenido:{
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  }
);

const Comment = model('Comment', CommentSchema)
 
module.exports = Comment