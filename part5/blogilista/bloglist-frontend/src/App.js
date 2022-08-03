import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [title, setTitle]= useState('')
  const [author, setAuthor]= useState('')
  const [url, setUrl]=useState('')

  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //??
 // const blogsToShow= showAll ? blogs : blogs.sort(function(a,b){ return a.likes - b.likes})
  const blogsToShow= blogs.sort(function(a,b){ return b.likes - a.likes})

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs( blogs ))  
  }, [])

  useEffect(()=>{
    const loggedUserJSON=window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON){
      const user= JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try{
        const user= await loginService.login({ username, password })
        window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
        blogService.setToken(user.token)
        setUser(user)
        setUsername('')
        setPassword('')
      
    }catch (e){
      console.log(username, password)
      if (username.length ===0|| password.length===0){
        setErrorMessage('type in password and name')
        setTimeout(()=>{
          setErrorMessage(null)
        }, 4000)}else{
           setErrorMessage('wrong login credentials')
      setTimeout(()=>{
        setErrorMessage(null)
      }, 4000)
        }
     
    }
  }
  const handleLogout= (event) =>{
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }
  const addBlog=(blogObject)=>{
    blogService
    .create(blogObject)
    .then(returnedBlog=>{
      setBlogs(blogs.concat(returnedBlog))
    })
    .catch(error =>{
      console.log(error.response.data)
      setErrorMessage('cannot add a blog, check if all fields have been filled')
      setTimeout(()=>{
      setErrorMessage(null)
      }, 4000)    
    })
      
      
}
   
  
/*
  const addBlog=async (event)=>{
    event.preventDefault()
    const blog={
      title: title,
      author: author,
      url: url
    }
    console.log(blog)
    try{
      const newBlog= await blogService.create(blog)
      const loggedInUser= JSON.parse(window.localStorage.getItem('loggedBlogAppUser'))
      newBlog.user={username: loggedInUser.username, name: loggedInUser.name}
      setBlogs(blogs.concat(newBlog))
      setNewBlog('')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (e){
      setErrorMessage('cannot add a blog, check if all fields have been filled')
      setTimeout(()=>{
        setErrorMessage(null)
      }, 4000)
    }
  }
  */
  

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage}></Notification>
      {user === null ?
      <Togglable buttonLabel='login'>
        <LoginForm username={username} password={password} 
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}>
        </LoginForm>
      </Togglable> :
      <div>
          <p>{user.name} is logged in</p>
          <Togglable buttonLabel='New blog'>
            <BlogForm createBlog={addBlog}>
            </BlogForm>
          </Togglable>
          <div>
            <button id='logout-button' onClick={handleLogout}>Logout</button>
          </div> 
          <div>
        <ul>
            {blogsToShow.map((blog, i)=>
              <Blog key={i} blog={blog} ></Blog>
            )}
          </ul>
      </div>
      </div>
      }
   </div>
  )
}

export default App
/*
title={title} author={author} url={url}
            handleAuthorChange={({ target })=> setAuthor(target.value)}
            handleTitleChange={({ target })=> setTitle(target.value)}
            handleUrlChange={({ target })=> setUrl(target.value)}
            handleSubmit={handleBlogAdding} >
*/