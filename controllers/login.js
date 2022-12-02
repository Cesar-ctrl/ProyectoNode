const jwt = require('jsonwebtoken')
//jsonwebtoken permite la creación de tokens
const bcrypt = require('bcrypt')
//bcrypt es una función de hashing de contraseñas
const loginRouter = require('express').Router()
const User = require('../models/User')

//Método post para enviar y comprobar la información de inicio de sesión 
loginRouter.post('/', async (request, response) =>{
    const { body } = request 
    const { email, password } = body 


    const user = await User.findOne({ email })
    
    //Aquí compara la contraseña dada con la codificada en la BD
    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      response.status(401).json({
        error: 'invalid user or password'
      })
    }

    const userForToken = {
        id: user._id,
        email: user.email
    }

    // Creación de un Token para un Id y un email especificos
    const token = jwt.sign(
        userForToken,
        'LoremipsumdolorsitametconsecteturadipiscingelitNuncnonporttitorligulaUtcommodomaurisnomagnaegestavolutpatmieuismodgracias',
        {
          expiresIn: 60 * 60 * 24 * 7
        }
      )
    //Envia la respuesta
    console.log(user)
    response.send({
        id: user._id,
        name: user.name,
        email: user.email,
        hijos: user.hijos,
        token,
        guards: user.guards
    })
})

module.exports = loginRouter