const Blog= require('../models/blog')

const initialBlogs=[
    {
        title: 'Title',
        author: 'name',
        url: 'www url',
        likes: 2
    },
    {
        title: 'toinen title',
        author: 'toinen author',
        url: 'toinen url',
        likes: 3
    }
]

const blogsInDB= async()=>{
    const blogs= await Blog.find({})
    return blogs.map(blog=>blog.toJSON())
}

module.exports={
    initialBlogs, blogsInDB
}