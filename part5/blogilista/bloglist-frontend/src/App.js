import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

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

  const blogsToShow= showAll ? blogs : blogs.filter(blog=>blog.id)

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

  const handleBlogAdding=async (event)=>{
    event.preventDefault()
    const blog={
      title: title,
      author: author,
      url: url
    }
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
  

  const loginForm=()=>(
    <form onSubmit={handleLogin}>
    <div>
      username: <input type="text" 
                        value={username} 
                        name="Username" 
                        onChange={({ target })=> setUsername(target.value)}>
                </input>
    </div>
    <div>
      password: <input type="password" 
                        value={password} 
                        name="Password" 
                        onChange={({ target })=> setPassword(target.value)}>
                </input>
    </div>
    <button type="submit">login</button>
  </form>
  )
  const blogForm=()=>(
    <div>
      <div>
        <button id='logout-button' onClick={handleLogout}>Logout</button>
      </div>      
    < form onSubmit={handleBlogAdding}>
        <p>
        title: <input type="text"
                value={title}
                name="Title"
                onChange={({ target })=> setTitle(target.value)}>
        </input>
        </p>
        <p>
        author: <input type="text"
                value={author}
                name="Author"
                onChange={({ target })=> setAuthor(target.value)}>
        </input>
        </p>
        <p>
         url: <input type="text"
                value={url}
                name="Url"
                onChange={({ target })=> setUrl(target.value)}>
        </input>
        </p>
        
        <button type="submit">create</button>
      </form>
    </div>
    )

    if (user === null){
      return (
        <div>
          <Notification message={errorMessage}></Notification>
          <h2>
            login to application
          </h2>
          {loginForm()}
        </div>
      )
    }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={errorMessage}></Notification>
        <div> 
          <p>{user.name} is logged in</p>
          {blogForm()}
        </div>
        <ul>
            {blogsToShow.map((blog, i)=>
            <Blog key={i} blog={blog} ></Blog>
            )}
          </ul>
   </div>
  )
}

export default App
