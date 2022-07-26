const mongoose= require('mongoose')
const supertest= require('supertest')
const bcrypt = require('bcrypt')
const helper=require('./test_helper')
const app= require('../app')
const api =supertest(app)
const Blog=require('../models/blog')
const User = require('../models/user')
const JWT_BEARER_TOKEN='bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

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
describe('when one user at database to start', ()=>{
    beforeEach(async()=>{
        await User.deleteMany({})
        const pwHash= await bcrypt.hash('sekret', 10)
        const user= new User({ username: 'root', pwHash})
        await user.save()
    })
    test('creation is succesful with a new username', async()=>{
        const usersAtFirst= await helper.usersInDB()
        const addUser={
            username: "uusinimi",
            name: "uusiniminimi",
            password: "salasana"
        }
        await api
            .post("/api/users")
            .send(addUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const atEnd=await helper.usersInDB()
        //yks lisää dbssä
        expect(atEnd).toHaveLength(usersAtFirst.length+1)
        expect(atEnd.map(u=>u.username)).toContain(addUser.username)

    })
    test('cant create if username taken, gives 400 when tried', async()=>{
        const usersAtFirst=await helper.usersInDB()
        const sameNameUser={
            username: 'root',
            name: "erinimi",
            password: "salasana"
        }
        const result=await api
            .post("/api/users")
            .send(sameNameUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const atEnd=await helper.usersInDB()
        expect(atEnd).toHaveLength(usersAtFirst.length)
        expect(result.body.error).toContain("username already in use, try again")
        })
})


afterAll(()=>{
    mongoose.connection.close()
})