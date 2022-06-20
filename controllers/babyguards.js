const bcrypt = require('bcrypt')
//bcrypt es una función de hashing de contraseñas
const babyguardsRouter = require('express').Router()
const Babyguard = require('../models/Babyguard')

//Método get para traer todos los cuidadores
babyguardsRouter.get('/', async (request, response) =>{
    const babyguards = await Babyguard.find({})
    response.json(babyguards)
})

//Método get para traer a un cuidador en especifico con el id de este
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

//Método get para un cuidador en especifico con el id de este,
// trae la información del cuidador y de los usuarios con los que tiene abierto una conversación 
babyguardsRouter.get('/chat/:id', async (request, response) =>{
  const { id } = request.params
  await Babyguard.findById(id).populate('chats', {
      name:1,
      surnames:1,
      hijos:1,
      imgUrl:1
  })
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

//Método post para crear un guard
babyguardsRouter.post('/', async(request, response) => {
    const { body } = request
    const { name, surnames, DNI, phone, email, dias, horarioinicio, horariofin, disponible, password } = body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newbabyguard = new Babyguard ({
        name,
        surnames,
        DNI,
        phone,
        email,
        dias,
        horarioinicio,
        horariofin,
        disponible,
        imgUrl:"1655398811921.jpg",
        passwordHash
    })
    const savedBabyguard = await newbabyguard.save() 
    response.json(savedBabyguard)
})

//Método post para crear una conversación se manda el id del usuario con el que se va a tener la conversación y se agrega a la lista de chats
babyguardsRouter.post('/chat/:id', async (request, response, next) => {
  const { id } = request.params
  const guard = request.body
  
  const newGuardInfo = {
      chats: guard.chats
  }
  try {
      const babyguard = await Babyguard.findById(id)
      babyguard.chats = babyguard.chats.concat(newGuardInfo.chats) 
      response.json(babyguard)
      await babyguard.save() 
  } catch (error) {
      console.log(error)
      next(error)
  }
})

//Método put para cambiar la disponibilidad de los guards
babyguardsRouter.put('/disp/:id', async (request, response, next) => {
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

// Método put para editar la información completa o parcial de un guard
babyguardsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const guard = request.body
  const newGuardInfo = {
    name: guard.name,
    surnames: guard.surnames,
    phone: guard.phone,
    dias: guard.dias,
    horarioinicio: guard.horarioinicio,
    horariofin: guard.horariofin,
    descripcion: guard.descripcion,
    imgUrl:guard.imgUrl
  }
  
  Babyguard.findByIdAndUpdate(id, newGuardInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})

//Método put para cambiar la descipción de un guard
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

//Método put para cambiar los horarios de un guard
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

//Método delete para borrar a un cuidador
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

  

module.exports = babyguardsRouter