const solicitudesRouter = require('express').Router()
const Solicitud = require('../models/Solicitud')
const userExtractor = require('../middleware/userExtractor')
const { CONSOLE_LEVELS } = require('@sentry/utils')

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
    const { aprobado, user } = request.body;
    const respuesta = {aprobado:aprobado}
    // Idea Si alguien pone true, despues actualize todas las solicitudes que no sean true
    // y ponerlas en false
    console.log(aprobado)
    if(aprobado){
        const respuesta = {
            aprobado:aprobado,
            acabado:false
        }
        Solicitud.updateMany({ "user":user }, { $set: { aprobado: false } })
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


solicitudesRouter.delete('/:id', async (request, response) => {
    //Idea, este comando solo se haga cuando alguien y justo antes ha aceptado la solicitud
    // Despues buscar todos los de una persona que aprobado sea false 
    //Si vienen en false solo hay que poner el filtro de delete los false
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    console.log(id)
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.deleteMany({
        user:id,
        aprobado:false
    })
    .then(respuesta => {
        if (respuesta){
            return response.json(respuesta)
            console.log(resp.id)
            //Solicitud.findById(respuesta.id)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        console.log(err)   
    })

})

module.exports = solicitudesRouter