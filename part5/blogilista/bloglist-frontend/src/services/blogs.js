import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

//lisää tokenin pyynnön authorization headeriin 
let token= null
const setToken = newToken=>{
  token=`bearer ${newToken}`
}

const create = async newObject=>{
  const config= {headers: { Authorization: token },}
  const response= await axios.post(baseUrl, newObject, config)
  return response.data
}

const update=(id, newObject)=>{
  const request = axios.put(`${ baseUrl } /${id}`, newObject)
  return request.then(response => response.data)
}


export default { getAll, create, update, setToken }