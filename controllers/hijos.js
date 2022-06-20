const bcrypt = require('bcrypt')
const hijosRouter = require('express').Router()
const Hijo = require('../models/Hijo')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

//Método get para traer todos los niños
hijosRouter.get('/', userExtractor, async (request, response) =>{
    const hijos = await Hijo.find({}).populate('user', {
      username: 1,
      name: 1,  
      id: 1
    })
    response.json(hijos)
})

//Método get para traer a un niño junto con un poco de información del padre
hijosRouter.get('/:id', userExtractor, async (request, response) =>{
  const { id } = request.params
  const hijo = await Hijo.findById(id).populate('user', {
    name: 1,  
    id: 1
  })
  response.json(hijo)
})

//Método post para crear un niño, se debe especificar a que usuario pertenece
hijosRouter.post('/', userExtractor, async(request, response, next) => {
    const { name, surnames, edad, DNI, alergenos, necesidadesesp, imgUrl } = request.body
    const { userId } = request
    const user = await User.findById(userId)

    const newHijo = new Hijo ({
        name,
        surnames,
        edad,
        DNI,
        alergenos,
        necesidadesesp,
        user: user._id,
        imgUrl:imgUrl
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

// Método put para editar la información completa o parcial de un niño
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

//No he añadido método delete, sería muy triste tener que borrar a un niño

module.exports = hijosRouter
