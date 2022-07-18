const mongoose= require('mongoose')
const supertest= require('supertest')
const helper=require('./test_helper')
const app= require('../app')
const api =supertest(app)
const Blog=require('../models/blog')

beforeEach(async()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs returned as json', async()=>{
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('all blogs returned', async()=>{
    const response= await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
})
/*
test('find specific blog', async()=>{
    const response=await api.get('/api/blogs')
    const contents= response.body.map(r=>r.title)
    expect(contents).toContain('toinen title')
})*/
test('valid blog added', async()=>{
    const newBlog= {
            title: 'otsikko',
            author: 'kirjailja',
            url: 'www urlurl',
            likes: 1
        }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    //const response= await api.get('/api/blogs')
    const blogsAtTheEnd= await helper.blogsInDB()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length+1)

    const contents= blogsAtTheEnd.map(r=>r.title)
    expect(contents).toContain('otsikko')
})

test('blog without url and title return 401', async()=> {
    const newBlog={
        author:'kirjailija ilman muuta',
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const blogsAtTheEnd=await helper.blogsInDB()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length)
})

test('blog without given value: likes, the value is set to zero', async()=>{
    const newBlog={
        title: 'otsikkonolla',
        author: 'kirjailja',
        url: 'wwwurl'        
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtTheEnd= await helper.blogsInDB()
    const blogNoLikes= blogsAtTheEnd.find(blog=>blog.title==='otsikkonolla')
    expect(blogNoLikes.likes).toBe(0)
})

test('all blogs have id', async()=>{
    const blogsAtTheEnd=await helper.blogsInDB()
    for(blog of blogsAtTheEnd){
        expect(blog.id).toBeDefined()
    }
})
test('delete blog, returns 204', async()=>{
    const blogsAtStart= await helper.blogsInDB()
    const blogToDelete= blogsAtStart[0]
    console.log(blogToDelete.id)

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    const blogsAtTheEnd=await helper.blogsInDB()
    expect(blogsAtTheEnd).toHaveLength(helper.initialBlogs.length-1)
    expect(blogsAtTheEnd.map(r=>r.title)).not.toContain(blogToDelete.title)
})
test('modify a blog ', async()=>{
    const blogsAtStart= await helper.blogsInDB()
    const blogToModify= blogsAtStart[0]
    const modifiedBlog= {
        title: blogToModify.title,
        author: blogToModify.author,
        url: blogToModify.url,
        likes: blogToModify.likes+3
    }
    await api
        .put(`/api/blogs/${blogToModify.id}`)
        .send(modifiedBlog)
        .expect(200)
    const blogsAtTheEnd= await helper.blogsInDB()
    const modifiedAfter=blogsAtTheEnd.find(blog=>blog.id ===blogToModify.id)
    expect(modifiedAfter.likes).toBe(blogToModify.likes+3)
})


afterAll(()=>{
    mongoose.connection.close()
})