const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/User')
const Hijo = require('../models/Hijo')
const userExtractor = require('../middleware/userExtractor')

usersRouter.get('/', async (request, response) =>{
    const users = await User.find({}).populate('hijos', {
        name:1,
        surnames:1,
        edad:1,
        DNI:1,
        alergenos:1,
        necesidadesesp:1
    })
    response.json(users)
})

usersRouter.get('/:id', async (request, response) =>{
    const { id } = request.params
    await User.findById(id).populate('hijos', {
        name:1,
        surnames:1,
        edad:1,
        DNI:1,
        alergenos:1,
        necesidadesesp:1,
        imgUrl:1
    })
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

usersRouter.get('/hijos/:id', async (request, response) =>{
    const { id } = request.params
    await User.findById(id).populate('hijos', {
        name:1,
        surnames:1,
        edad:1,
        DNI:1,
        alergenos:1,
        necesidadesesp:1
    })
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

usersRouter.get('/fav/:id', async (request, response) =>{
    const { id } = request.params
    await User.findById(id).populate('guards', {
        name:1,
        surnames:1,
        horarioinicio:1,
        horariofin:1,
        disponible:1,
        imgUrl:1,
        chats:1
    })
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

usersRouter.post('/', async(request, response) => {
    const { username, name, surnames, DNI, phone, email, password } = request.body
    
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

usersRouter.post('/fav/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const user = request.body
    
    const newUserInfo = {
        guards: user.guards
    }
    try {
        const usuario = await User.findById(id)
        usuario.guards = usuario.guards.concat(newUserInfo.guards) 
        response.json(usuario)
        await usuario.save() 
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.put('/fav/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const user = request.body

    try {
        const usuario = await User.findById(id)
        console.log(usuario.guards)
        let guardd = user.guards
        console.log(guardd)
        usuario.guards = usuario.guards.filter(item => item.toHexString() !== guardd);
        response.json(usuario)
        await usuario.save() 
    } catch (error) {
        console.log(error)
        next(error)
    }    

  })

usersRouter.put('/:id', userExtractor, async (request, response, next) => {
    const { id } = request.params
    const user = request.body
    const newUserInfo = {
        name: user.name,
        surnames: user.surnames,
        phone: user.phone,
        guards: user.guards,
        imgUrl:user.imgUrl
    }
    
    
    User.findByIdAndUpdate(id, newUserInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch(next)
  })


usersRouter.post('/chat/:id', async (request, response, next) => {
    const { id } = request.params
    const user = request.body
    
    const newUserInfo = {
        chats: user.chats
    }
    try {
        const usuario = await User.findById(id)
        usuario.chats = usuario.chats.concat(newUserInfo.chats) 
        response.json(usuario)
        await usuario.save() 
    } catch (error) {
        console.log(error)
        next(error)
    }
})

usersRouter.get('/chat/:id', async (request, response) =>{
    const { id } = request.params
    await User.findById(id).populate('chats', {
        name:1,
        surnames:1,
        horarioinicio:1,
        horariofin:1,
        disponible:1,
        imgUrl:1,
        chats:1
    })
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

module.exports = usersRouter