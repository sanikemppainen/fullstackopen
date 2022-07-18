const dummy = (blogs) => {
    return 1
}

const totalLikes=(blogs)=>{
    return blogs.map(blog=>blog.likes).reduce((acc, like)=> like+acc)
}

const favoriteBlog=(blogs)=>{
    let mostLiked=blogs[0]
    let mostLikes=0

    blogs.map(blog=>{
        if(blog.likes>mostLikes){
            mostLikes=blog.likes
            mostLiked=blog
        }
    })
    return {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
}
const mostBlogs=(blogs)=>{
    let map= new Map()

    blogs.map(blog=>{
        if(!map.has(blog.author)){
            map.set(blog.author, 1)
        } else {
            map.set(blog.author, map.get(blog.author)+1)
        }
    })

    //etsi isoin arvo ja sen kirjoittaja
    const mostBlogsValues=([...map.entries()].reduce((i, ii)=> ii[1]>i[1] ? ii : i))
    return {
        author: mostBlogsValues[0],
        blogs: mostBlogsValues[1]
    }}

const mostLikes=(blogs)=>{
    let map= new Map()

    blogs.map(blog=>{
        if(!map.has(blog.author)){
            map.set(blog.author, blog.likes)
        } else {
            map.set(blog.author, map.get(blog.author)+ blog.likes)
        }
    })

    //etsi isoin arvo ja sen kirjoittaja
    const mostLikesValues=([...map.entries()].reduce((i, ii)=> ii[1]>i[1] ? ii : i))
    return {
        author: mostLikesValues[0],
        likes: mostLikesValues[1]
    }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
