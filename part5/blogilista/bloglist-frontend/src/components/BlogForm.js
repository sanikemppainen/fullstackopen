import { useState } from "react"

const BlogForm=({ createBlog })=>{

        const [newTitle, setNewTitle]= useState('')
        const [newAuthor, setNewAuthor]= useState('')
        const [newUrl, setNewUrl]=useState('')
        
        const handleAuthorChange=(event)=>{
            setNewAuthor(event.target.value)
        }
        const handleTitleChange=(event)=>{
            setNewTitle(event.target.value)
        }
        const handleUrlChange=(event)=>{
            setNewUrl(event.target.value)
        }
        const addBlog=(event)=>{
            event.preventDefault()
            createBlog({
            title: newTitle,
            author: newAuthor,
            url: newUrl
            })

            setNewTitle('')
            setNewAuthor('')
            setNewUrl('')
        }

    return(
        <div>
            <h2>create a new blog</h2>
            < form onSubmit={addBlog}>
                <p>
                title: <input type="text"
                        value={newTitle}
                        onChange={handleTitleChange}>
                </input> </p>
                <p>
                author: <input type="text"
                        value={newAuthor}
                        onChange={handleAuthorChange}>
                </input> </p>
                <p>
                url: <input type="text"
                        value={newUrl}
                        onChange={handleUrlChange}>
                </input></p>
            <button type="submit">create</button>
            </form>
        </div>
    )
}
export default BlogForm