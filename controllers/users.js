const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (request, response) =>{
    const users = await User.find({}).populate('notes', {
        content:1,
        date:1
    })
    response.json(users)
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

usersRouter.put('/fav/:id', async (request, response, next) => {
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