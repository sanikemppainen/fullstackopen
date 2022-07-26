const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

/*
loginRouter.post('/', async(req, res)=>{
  const username= req.body.username
  const user= { name: username }
  const accessToken= jwt.sign(user, process.env.SECRET)
  res.json({ accessToken: accessToken })
})
*/
loginRouter.post('/', async(request, response) => {
  const { username, password } = request.body
  //etsii usernamea vastaavan käyttäjän dbstä
  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password!'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

/*
  let passwordOK=false
  if(user !== null){
    passwordOK= await bcrypt.compare(password, user.passwordHash)
    //response.json({ token:token })
  }
  console.log('menee tänne')
  if (!(user && passwordOK)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }
  //luo token
  const userToken = {
    username: user.username,
    id: user._id,
  }
  const token = jwt.sign(userToken, process.env.SECRET)
  //console.log("logingin token: ", token)
  */
  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter