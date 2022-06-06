const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const Hijo = require('../models/Hijo')
const userExtractor = require('../middleware/userExtractor')

usersRouter.get('/', async (request, response) =>{
    const users = await User.find({}).populate('notes', {
        content:1,
        date:1
    })
    response.json(users)
})

usersRouter.get('/:id', async (request, response) =>{
    const { id } = request.params
    User.findById(id)
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

usersRouter.get('/hijos/:id', userExtractor, async (request, response) =>{
    const { id } = request.params
    const user = request.params
    
    await User.findById(id).populate('hijos', {
        name:1,
        surnames:1,
        edad:1,
        dni:1,
        alergenos:1,
        necesidadesesp:1
    })
    .then(user => {
        if (user){
            response.json(user)

        } else {
            response.status(404).end()
        }
    }).catch(err => {
        next(err)   
    })
   
})

usersRouter.post('/', async(request, response) => {
    const { body } = request
    const { username, name, surnames, DNI, phone, email, password } = body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username,
        name,
        surnames,
        DNI,
        phone,
        email,
        passwordHash
    })
    
    const savedUser = await user.save() 
    
    response.status(201).json(savedUser)
})

usersRouter.put('/fav/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const user = request.body
    
    const newGuardInfo = {
        guards: user.guards
    }
    
    User.findByIdAndUpdate(id, newGuardInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })

usersRouter.put('/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const user = request.body
    
    const newGuardInfo = {
        guards: user.guards
    }
    
    User.findByIdAndUpdate(id, newGuardInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })

module.exports = usersRouter