const bcrypt = require('bcrypt')
const hijosRouter = require('express').Router()
const Hijo = require('../models/Hijo')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

hijosRouter.get('/', async (request, response) =>{
    const hijos = await Hijo.find({}).populate('user', {
      username: 1,
      name: 1,  
      id: 1
    })
    response.json(hijos)
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

module.exports = hijosRouter
