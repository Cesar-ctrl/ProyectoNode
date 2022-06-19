const Messages = require("../models/Message");
const messagesRouter = require('express').Router()

messagesRouter.post('/getmsg', async (request, response, next) => {
  try {
    const { from, to } = request.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

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