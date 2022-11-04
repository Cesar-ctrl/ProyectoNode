const solicitudesRouter = require('express').Router()
const Solicitud = require('../models/Solicitud')
const userExtractor = require('../middleware/userExtractor')
const { CONSOLE_LEVELS } = require('@sentry/utils')

solicitudesRouter.get('/:id', async (request, response) => {

    console.log(request)
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({
        guard:id
    }).populate('user',{
        name: 1,
        surnames: 1,
        imgUrl: 1,
        historialContratos: 1
    })
    .then(res => {
        if (res){
            return response.json(res)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        console.log(err)   
    })

})

solicitudesRouter.get('/history/:id', async (request, response) => {

    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({
        user:id
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

solicitudesRouter.post('/solicitado', async (request, response) => {

    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { user, guard } = request.body;
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({
        user:user,
        guard:guard
    })
    .then(respuesta => {
        if (respuesta){
            return response.json(respuesta)
        } else {
            return response.json(respuesta)
        }
    }).catch(err => {
        console.log(err)   
    })

})


solicitudesRouter.post('/send', async (request, response) => {
    //Primero se hace el post para crear las solicitudes, una persona puede mandar solicitudes a mas de una niñera
    //pero solo puede contratar a una niñera a la vez.

    const { user, guard } = request.body;
    const solicitud = new Solicitud({
        user:user,
        guard:guard
    })
    const savedSolicitud = await solicitud.save()
    .then(result => {
        if (result){
            return response.json(result)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        console.log(err)   
    })
})

solicitudesRouter.put('/:id', async (request, response) => {
    //Las niñeras aceptan o rechazar las solicitudes
    //pero cuando una niñera acepta una solicitud las demás solicitudes deben invalidarse
    //para esto si recibe una solicitud aceptada todas las demas se ponen como rechazadas

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
        await Solicitud.updateMany({ "user":user }, { $set: { aprobado: false } })
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
        await Solicitud.findByIdAndUpdate(id, respuesta, { new: true })
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
    //Pero las niñeras no tienen que ver una solicitud aceptada por otra persona
    //así que se ejecuta este delete despues de una solicitud aceptada.
    //Aquí borra todas las solicitudes que estan rechazadas.
    //Y como por defecto se ponen rechazadas todas las solicitudes cuando una se acepta borra las solicitudes
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