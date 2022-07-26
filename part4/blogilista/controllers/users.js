const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async(request, response)=>{
    //populate laittaa näkymään kaikki sen käyttäjän blogien tiedot kun haetaan käyttäjiä
    const users= await User
        .find({}).populate('blogs')
    response.json(users)
})

//tallenna käyttäjä
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //correctly filled
  if(username === undefined || name === undefined || password === undefined){
    return response.status(400).json({ error: 'fill all fields' })
  }
  if(username.length < 3){
    return response.status(400).json({ error: 'username should be min 3 characters long'})
  }
  if(password.length < 3){
    return response.status(400).json({ error: 'password should be min 3 characters long'})
  }

  const userExists= await User.findOne({ username })
  //check database 
  if(userExists){
    return response.status(400).json({ error: "username already in use, try again" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter