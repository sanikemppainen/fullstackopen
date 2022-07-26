const jwt= require('jsonwebtoken')
const blogsRouter= require('express').Router()
const Blog= require('../models/blog')
const User = require('../models/user')
require('dotenv').config()

const getTokenFrom = request => {
  const authorization = request.get('authorization')  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  //populaten tyypit määritelty ref kenttään scheman luonnissa
  const blogs= await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async(request, response) => {
  const body=request.body
  const token = getTokenFrom(request)
 
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })  
    }
 
  const user = await User.findById(decodedToken.id)
  
  //const user= request.user

  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({
        error: 'missing title or url'
    })
}
  body.likes= body.likes || 0

  const blog= new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id 
  })
  
  const savedBlog= await blog.save()
  //tallentaa blogs kenttään sen userin kohdalle luodun blogin id:n
  user.blogs=user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

//remove a blog

blogsRouter.delete('/:id', async (request, response) => {
  const blog=await Blog.findById(request.params.id)
  const user= request.user
  if(blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else{
    return response.status(401).json({ error: 'invalid token for deleting' })
  }

})

//modify a blog('s likes)
blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }
  Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updated=>{
      response.json(updated)
    }).catch(e=>next(e))
})

  module.exports=blogsRouter