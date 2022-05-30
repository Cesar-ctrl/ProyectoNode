const bcrypt = require('bcrypt')
const babyguardsRouter = require('express').Router()
const Babyguard = require('../models/Babyguard')

babyguardsRouter.get('/', async (request, response) =>{
    const babyguards = await Babyguard.find({})
    response.json(babyguards)
})

babyguardsRouter.post('/', async(request, response) => {
    const { body } = request
    const { name, surnames, DNI, email, dias, horario, disponible, password } = body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newbabyguard = new Babyguard ({
        name,
        surnames,
        DNI,
        email,
        dias,
        horario,
        disponible,
        passwordHash
    })
    
    const savedBabyguard = await newbabyguard.save() 
    
    response.json(savedBabyguard)
})

module.exports = babyguardsRouter