const bcrypt = require('bcrypt')
//bcrypt es una función de hashing de contraseñas
const usersRouter = require('express').Router()
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

//Método get para traer todos los usuarios más los hijos que tiene
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

//Método get para traer a un cuidador en especifico con el id de este
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

//Método get para traer la información de un usuario y sus hijos
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

//Método get para traer un usuario y información necesaria de sus cuidadores favoritos
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

//Método get para un usuario en especifico con el id de este,
// trae la información del usuario y de los cuidadores con los que tiene abierta una conversación 
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

//Método post para crear un Usuario
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
        passwordHash,
        imgUrl:"1655398811921.jpg"
    })
    
    const savedUser = await user.save()    
    response.status(201).json(savedUser)
})

//Es el método para añadir favoritos
//Método post recibe un id de cuidador y de un usuario, 
// en el usuario especificado en el campo guards, mete la id del cuidador
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

//Método post para crear una conversación, se manda el id del cuidador con el que se va a tener la conversación y se agrega a la lista de chats
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

//Es el método para eiminar favoritos
//Método put recibe un id de cuidador y de un usuario, 
// en el usuario especificado en el campo guards, elimina la id del cuidador
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

//Método put para cambiar la información de usuario
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

module.exports = usersRouter