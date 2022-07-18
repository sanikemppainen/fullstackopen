const blogsRouter= require('express').Router()
const Blog= require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs= await Blog.find({})
  response.json(blogs)
})
  
blogsRouter.post('/', async(request, response) => {
  const body=request.body

  const blog= new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  })
  
  const savedBlog= await blog.save()
  response.status(201).json(savedBlog)
})

//remove a blog

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
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