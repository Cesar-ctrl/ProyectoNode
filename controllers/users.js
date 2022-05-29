const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) =>{
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async(request, response) => {
    const { body } = request
    const { username, name, surnames, password } = body

    const saltRounds = 10 
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User ({
        username,
        name,
        surnames,
        passwordHash
    })
    
    const savedUser = await user.save() 
    
    response.json(savedUser)
})

module.exports = usersRouter