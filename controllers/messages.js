const Messages = require("../models/Message");
const messagesRouter = require('express').Router()

//Método Post para recibir el usuario que envia y el que recibe
//para luego enviar todos los mensajes con esos dos participantes
// No hay distinción entre Niñeras y usuarios en este método.
messagesRouter.post('/getmsg', async (request, response, next) => {
  try {
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { from, to } = request.body;
    
    //Busca todos los mensajes que tengan el usuario especificado
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    //Devuelve todos los menajes 
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    response.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
})
messagesRouter.post('/getlastmsg', async (request, response, next) => {
  try {
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { from, to } = request.body;
    
    //Busca todos los mensajes que tengan el usuario especificado
    const messages = await Messages.find({
      users: {
        $all: [ to],
      },
    }).sort({ updatedAt: 1 });


    //Devuelve todos los menajes 
    console.log(messages[messages.length -1])
    const projectedMessages = messages[messages.length -1]
    response.json(projectedMessages);
      return {
        fromSelf: messages[messages.length -1].sender.toString() === from,
        message: messages[messages.length -1].message.text,
      };
    
    
  } catch (ex) {
    next(ex);
  }
})

//Método post para enviar mensajes al igual que recibir tiene un to y from pero a demas tiene el mensaje
messagesRouter.post('/addmsg', async (request, response, next) => {
  try {
    const { from, to, message } = request.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return response.json({ msg: "Message added successfully." });
    else return response.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
})

module.exports = messagesRouter