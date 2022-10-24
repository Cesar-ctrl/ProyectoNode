const solicitudesRouter = require('express').Router()
const Solicitud = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

solicitudesRouter.get('/:id', async (request, response) => {
    try {
        //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
        const { id } = request.params
        const { user, guard } = request.body;
        
        //Busca todos los mensajes que tengan el usuario especificado
        await Solicitud.find({
            guard:id
        }).populate('user', {
            id:1,
            name:1,
            surnames:1,
            imgUrl:1
        })
        .then(user => {
            if (user){
                return response.json(user)
            } else {
                response.status(404).end()
            }
        }).catch(err => {
            console.log(err)   
        })

      } catch (ex) {
        next(ex);
      }
})

module.exports = solicitudesRouter