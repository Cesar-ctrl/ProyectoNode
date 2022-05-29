const bcrypt = require('bcrypt')
const hijosRouter = require('express').Router()
const Hijo = require('../models/hijo')



hijosRouter.get('/', async (request, response) =>{
    const hijos = await Hijo.find({})
    response.json(hijos)
})

hijosRouter.post('/', async(request, response) => {
    const { body } = request
    const { username, name, surnames, password } = body

    const hijo = new Hijo ({
        name,
        surnames
    })
    
    const savedHijo = await hijo.save() 
    
    response.json(savedHijo)
})

module.exports = hijosRouter
