const bcrypt = require('bcrypt')
const hijosRouter = require('express').Router()
const Hijo = require('../models/Hijo')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

hijosRouter.get('/', userExtractor, async (request, response) =>{
    const hijos = await Hijo.find({}).populate('user', {
      username: 1,
      name: 1,  
      id: 1
    })
    response.json(hijos)
})

hijosRouter.get('/:id', userExtractor, async (request, response) =>{
  const { id } = request.params
  const hijo = await Hijo.findById(id).populate('user', {
    username: 1,
    name: 1,  
    id: 1
  })
  response.json(hijo)
})

hijosRouter.post('/', userExtractor, async(request, response, next) => {
    const { name, surnames, edad, DNI, alergenos, necesidadesesp } = request.body
    const { userId } = request
    const user = await User.findById(userId)

    const newHijo = new Hijo ({
        name,
        surnames,
        edad,
        DNI,
        alergenos,
        necesidadesesp,
        user: user._id
    })
    
    try {
        const savedHijo = await newHijo.save()
    
        user.hijos = user.hijos.concat(savedHijo._id)
        await user.save()
    
        response.json(savedHijo)
      } catch (error) {
        console.log(error)
        next(error)
      }
})

hijosRouter.put('/:id', userExtractor, async(request, response, next) => {
  const { id } = request.params
  const hijo = request.body

  const newHijoInfo = {
    name: hijo.name,
    surnames: hijo.surnames,
    edad: hijo.edad,
    DNI: hijo.DNI,
    alergenos: hijo.alergenos,
    necesidadesesp: hijo.necesidadesesp,
    imgUrl:hijo.imgUrl
  }

  await Hijo.findByIdAndUpdate(id, newHijoInfo, { new: true })
    .then(result => {
      response.json(result)
    })
    .catch(next)
})

module.exports = hijosRouter
