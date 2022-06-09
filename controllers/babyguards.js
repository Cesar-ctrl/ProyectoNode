const bcrypt = require('bcrypt')
const babyguardsRouter = require('express').Router()
const Babyguard = require('../models/Babyguard')



babyguardsRouter.get('/', async (request, response) =>{
    const babyguards = await Babyguard.find({})
    response.json(babyguards)
})

babyguardsRouter.get('/:id', async (request, response) =>{
  const { id } = request.params
  await Babyguard.findById(id)
  .then(guard => {
    if (guard){
        return response.json(guard)
    } else {
        response.status(404).end()
    }
    }).catch(err => {
      console.log(err)   
  })
})

babyguardsRouter.delete('/:id', async (request, response) =>{
  const { id } = request.params
  await Babyguard.findByIdAndDelete(id)
  .then(guard => {
    if (guard){
        return response.json(guard)
    } else {
        response.status(404).end()
    }
    }).catch(err => {
      console.log(err)   
  })
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
    const { name, surnames, DNI, email, dias, horarioinicio, horariofin, disponible, password } = body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newbabyguard = new Babyguard ({
        name,
        surnames,
        DNI,
        email,
        dias,
        horarioinicio,
        horariofin,
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

  babyguardsRouter.put('/desc/:id', async (request, response, next) => {
    const { id } = request.params
    const guard = request.body
    
    const newGuardInfo = {
      descripcion: guard.descripcion
    }
    
    Babyguard.findByIdAndUpdate(id, newGuardInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })

  babyguardsRouter.put('/horario/:id', async (request, response, next) => {
    const { id } = request.params
    const guard = request.body
    
    const newGuardInfo = {
      horarioinicio: guard.horarioinicio,
      horariofin: guard.horariofin
    }
    
    Babyguard.findByIdAndUpdate(id, newGuardInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })
  

module.exports = babyguardsRouter