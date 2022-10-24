const solicitudesRouter = require('express').Router()
const Solicitud = require('../models/Solicitud')
const userExtractor = require('../middleware/userExtractor')

solicitudesRouter.get('/:id', async (request, response) => {

    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({
        guard:id
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

})


solicitudesRouter.post('/send', async (request, response) => {

    const { user, guard } = request.body;
    const solicitud = new Solicitud({
        user:user,
        guard:guard
    })
    const savedSolicitud = await solicitud.save()
    response.status(201).json(savedSolicitud)
})

solicitudesRouter.put('/:id', async (request, response) => {

    const { id } = request.params
    const { aprobado } = request.body;
    const respuesta = {aprobado:aprobado}

    if(aprobado){
        const respuesta = {
            aprobado:aprobado,
            acabado:false
        }
        Solicitud.findByIdAndUpdate(id, respuesta, { new: true })
        .then(result => {
            if (result){
                return response.json(result)
            } else {
                response.status(404).end()
            }
        }).catch(err => {
            console.log(err)   
        })
    }else{
        Solicitud.findByIdAndUpdate(id, respuesta, { new: true })
        .then(result => {
            if (result){
                return response.json(result)
            } else {
                response.status(404).end()
            }
        }).catch(err => {
            console.log(err)   
        })
    }
    
})

module.exports = solicitudesRouter