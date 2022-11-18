const solicitudesRouter = require('express').Router()
const Solicitud = require('../models/Solicitud')
const UserModel = require('../models/User')
const Babyguard = require('../models/Babyguard')
const userExtractor = require('../middleware/userExtractor')
const { CONSOLE_LEVELS } = require('@sentry/utils')

solicitudesRouter.get('/:id', async (request, response) => {

    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({guard:id})
    .populate('user',{
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
    const userio = await UserModel.findById(id).populate('historialContratos',{
        id: 1,
        user: 1,
        guard: 1,
        aprobado:1
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

solicitudesRouter.get('/history/contratos/:id', async (request, response) => {

    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.find({
        guard:id,
        aprobado:true
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
        guard:guard,
        aprobado:null
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
        guard:guard,
        aprobado:null
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

    //esto ya funciona ahora hay que hacer que la solicitud aceptada pase a la nueva pestaña que hay que crear
    //Intentar crear notificaciones locales, que avisen a un usuario si se ha aceptado solicitud y notificaciones

    
    const { id } = request.params
    const { aprobado, user, guard } = request.body;
    const respuesta = {aprobado:aprobado}
    // Idea Si alguien pone true, despues actualize todas las solicitudes que no sean true
    // y ponerlas en false
    console.log(user)
    if(aprobado){
        const respuesta2 = {
            aprobado:aprobado,
            acabado:false
        }
        await Solicitud.updateMany({ "user":user, aprobado:null }, { $set: { aprobado: false } })
        .then(result => {
            if (result){
                //console.log(result)
            } 
        })
        Solicitud.findByIdAndUpdate(id, respuesta2, { new: true })
        .then(result => {
            if (result){
                //response.json(result)
            } else {
                response.status(404).end()
            }
        }).catch(err => {
            console.log("Err")
            console.log(err)   
        })
        const newGuardInfo = {
            disponible: true
        }
        await Babyguard.findByIdAndUpdate(guard, newGuardInfo, { new: true })
        try{
            var solicutudcont
            var usercont
            const solicitudfinded = await Solicitud.findById(id)
            .then(result => {
                console.log(result)
                solicutudcont = result
            })
            .catch(err => {
                console.log("err")
                console.log(err)   
            })
            const newUserInfo = {
                historialContratos: solicutudcont
            }
            const userfinded = await UserModel.findById(user)
            userfinded.historialContratos = userfinded.historialContratos.concat(newUserInfo.historialContratos)
            await userfinded.save() 

            const respuesta = await Solicitud.find({guard:guard})
            .populate('user',{
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

        }catch(err){
            console.log(err)
        }
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

solicitudesRouter.put('/acabar/:id', async (request, response) => {
    const { id } = request.params
    const { acabado, guard } = request.body;
    const respuesta = {acabado:acabado}

    await Solicitud.findByIdAndUpdate(id, respuesta, { new: true })

    const responde = await Solicitud.find({guard:guard})
    .populate('user',{
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


solicitudesRouter.delete('/:id', async (request, response) => {
    //Pero las niñeras no tienen que ver una solicitud aceptada por otra persona
    //así que se ejecuta este delete despues de una solicitud aceptada.
    //Aquí borra todas las solicitudes que estan rechazadas.
    //Y como por defecto se ponen rechazadas todas las solicitudes cuando una se acepta borra las solicitudes
    //from y to son o un usuario y un guard No se pueden comunicar entre usuarios ni entre guards
    const { id } = request.params
    //Busca todos los mensajes que tengan el usuario especificado
    const solicitud = await Solicitud.deleteMany({
        user:id,
        aprobado:false
    })
    .then(respuesta => {
        if (respuesta){
            return response.json(respuesta)
            //Solicitud.findById(respuesta.id)
        } else {
            response.status(404).end()
        }
    }).catch(err => {
        console.log(err)   
    })

})

module.exports = solicitudesRouter