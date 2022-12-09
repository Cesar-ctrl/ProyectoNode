const Comments = require("../models/Comment");
const commentsRouter = require('express').Router()
const userExtractor = require('../middleware/userExtractor')

//Método Post para recibir el usuario que envia y el que recibe
//para luego enviar todos los mensajes con esos dos participantes
// No hay distinción entre Niñeras y usuarios en este método.
commentsRouter.post('/getcomment', async (request, response, next) => {
  try {
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { to } = request.body;
    
    //Busca todos los mensajes que tengan el usuario especificado
    const comments = await Comments.find({
      users: {
        $all: [to],
      },
    }).populate('sender', {
        name:1,
        surnames:1,
        imgUrl:1,
    });

    //Devuelve todos los comentarios 
    const projectedComments = comments.map((comment) => {
      return {
        contenido: comment.contenido.text,
        valoracion: comment.valoracion,
        autor: comment.sender
      };
    });
    response.json(projectedComments);
  } catch (ex) {
    next(ex);
  }
})

commentsRouter.post('/getval', async (request, response, next) => {
  try {
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { to } = request.body;
    
    //Busca todos los mensajes que tengan el usuario especificado
    const comments = await Comments.find({
      users: {
        $all: [to],
      },
    })
    console.log(comments)
    var total = 0
    var lengt = 0

    //Devuelve todos los comentarios 
    const projectedComments = comments.map((comment) => {
      total += comment.valoracion
      //return {
      //  valoracion: comment.valoracion
      //};
    });
    console.log(total)
    lengt = comments.length
    var resultado = Math.round(total/lengt*10)/10
    console.log(resultado)
    response.json({total: resultado});
    return {
      total: resultado
    }
    
  } catch (ex) {
    next(ex);
  }
})

commentsRouter.post('/getvalcomments', async (request, response, next) => {
  try {
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { to } = request.body;
    
    //Busca todos los mensajes que tengan el usuario especificado
    const comments = await Comments.find({
      users: {
        $all: [to],
      },
    })

    //Devuelve todos los comentarios 
    const projectedComments = comments.map((comment) => {
      return {
        valoracion: comment.valoracion
      };
    });
    response.json(projectedComments);
  } catch (ex) {
    next(ex);
  }
})

//Método post para enviar mensajes al igual que recibir tiene un to y from pero a demas tiene el mensaje
commentsRouter.post('/addcomment', userExtractor, async (request, response, next) => {
  try {
    const { from, to, contenido, valoracion } = request.body;
    const data = await Comments.create({
        contenido: { text: contenido },
        valoracion:  valoracion ,
        users: [from, to],
        sender: from,
    });

    if (data) return response.json({ comment: "Message added successfully." });
    else return response.json({ comment: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
})

module.exports = commentsRouter