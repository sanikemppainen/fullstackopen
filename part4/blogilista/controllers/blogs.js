const blogsRouter= require('express').Router()
const jwt= require('jsonwebtoken')
const Blog= require('../models/blog')
const User = require('../models/user')
require('dotenv').config()

blogsRouter.get('/', async (request, response) => {
  //populaten tyypit määritelty ref kenttään scheman luonnissa
  const blogs= await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})
  
blogsRouter.post('/', async(request, response) => {
  console.log('post blog',request.body, request.user)
  const user= request.user
  if (!user) {
    return response.status(401).json({ error: 'token not correct (blogrouter)' })
  }
  const body=request.body
  body.likes= body.likes || 0
  if (body.title === undefined || body.url === undefined) {
    return response.status(400).json({
        error: 'missing title or url'
    })
}  
  const blog = new Blog({ ...request.body, user: user.id })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
 
})

//remove a blog

blogsRouter.delete('/:id', async (request, response) => {

  const token= request.token
  const user= request.user
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id || !token) {
    return response.status(401).json({ error: 'token missing or invalid' })
}
  const blog=await Blog.findById(request.params.id)
//  const id= request.params.id
  if(! blog === null){
    if(blog.user.toString() === user.id.toString()){
      await Blog.findByIdAndRemove(request.params.id)
      console.log('poistettu blogi')
      response.status(204).end()
    }
  } else{
    return response.status(401).json({ error: 'doesnt exist' })

  }
  
})

//modify a blog('s likes)
blogsRouter.put('/:id', async (request, response, next) => {
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id || !token) {
      return response.status(401).json({ error: 'token missing or invalid !' })  
    }
  const user= request.user
  const blogFound= await Blog.findById(request.params.id)
  if (!(user.id.toString()===blog.user.toString())) {
    return response.status(401).json({ error: 'only the owner of blog can modify it' })
}
  const body = request.body
  const blogNew = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }
  Blog.findByIdAndUpdate(request.params.id, blogNew, {new: true})
    .then(updated=>{
      response.json(updated)
    }).catch(e=>next(e))
    response.status(201).json(blogNew)
})

  module.exports=blogsRouter