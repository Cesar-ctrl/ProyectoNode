const bcrypt = require('bcrypt')
const babyguardsRouter = require('express').Router()
const Babyguard = require('../models/Babyguard')



babyguardsRouter.get('/', async (request, response) =>{
    const babyguards = await Babyguard.find({})
    response.json(babyguards)
})

babyguardsRouter.get('/fav', async (request, response) =>{
  const guard = request.body
  
  for (let index = 0; index < guard.guards.length; index++) {
    const newGuardInfo = {
      id: guard.guards[index]
    }

    const babyguards = await Babyguard.findById(guard.guards[index])
    response.json(babyguards)
  }
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


babyguardsRouter.put('/:id', async (request, response, next) => {
    const { id } = request.params
    const guard = request.body
    
    const newGuardInfo = {
      disponible: guard.disponible
    }
    
    Babyguard.findByIdAndUpdate(id, newGuardInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })

module.exports = babyguardsRouter