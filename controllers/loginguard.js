const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginguardRouter = require('express').Router()
const Babyguard = require('../models/Babyguard')

//LoginGuard es lo mismo que login pero solo para Niñeras
loginguardRouter.post('/', async (request, response) =>{
    const { body } = request 
    const { email, password } = body 
    
    const babyguard = await Babyguard.findOne({ email })
    
    const passwordCorrect = babyguard === null
    ? false
    : await bcrypt.compare(password, babyguard.passwordHash)

    if (!(babyguard && passwordCorrect)) {
      response.status(401).json({
        error: 'invalid user or password'
      })
    }

    const guardForToken = {
        id: babyguard._id,
        email: babyguard.email
      }

    const token = jwt.sign(
        guardForToken,
        'LoremipsumdolorsitametconsecteturadipiscingelitNuncnonporttitorligulaUtcommodomaurisnomagnaegestavolutpatmieuismodgracias',
        {
          expiresIn: 60 * 60 * 24 * 7
        }
      )

    response.send({
        id: babyguard.id,
        name: babyguard.name,
        email: babyguard.email,
        token
    })
})

module.exports = loginguardRouter