require('dotenv').config()
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('express-async-errors')
//const jwt=require('jsonwebtoken')

const blogsRouter = require('./controllers/blogs')
const usersRouter=require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

logger.info('connecting to ', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(()=>{
        logger.info('connected to db')})
    .catch((error)=>{
        logger.info('error connecting to db', error.message)
    })
app.use(cors())
//app.use(express.static.apply('build'))
app.use(express.json())
app.use(middleware.requestLogger)
//app.use(middleware.tokenExtractor)
//app.use(middleware.userExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports=app



