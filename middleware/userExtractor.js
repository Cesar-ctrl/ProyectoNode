const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const authorization = request.get('Authorization')
  let token = ''
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7)
  }
  const decodedToken = jwt.verify(token, "LoremipsumdolorsitametconsecteturadipiscingelitNuncnonporttitorligulaUtcommodomaurisnomagnaegestavolutpatmieuismodgracias")
  console.log(decodedToken)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const { id: userId } = decodedToken

  request.userId = userId

  next()
}