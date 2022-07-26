const logger = require('./logger')
//const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  //logger.info('request loggerissa: ',request.body.jwt)

  next()
}

/*const tokenExtractor=async (request, response, next)=>{
  //ekstraktoi token
  const authorization= request.get('Authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    request.token= authorization.substring(7)
  }else{
    request.token= null
  }
  try {
    const decodedToken = await jwt.verify(request.token, process.env.SECRET)
    request.decodedToken = decodedToken
  } catch (error) {
    request.decodedToken = null
  }
  request.token=authorization ?? null
  next()
}*/


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if(error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token! ' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}
/*
const userExtractor=async (request, response, next) => {
  const decodedToken= jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
  }
  request.user = await User.findOne({ username: decodedToken.username })
  
  next()
}

*/
module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
//  userExtractor,
//  tokenExtractor
}