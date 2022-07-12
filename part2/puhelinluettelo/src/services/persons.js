import axios from "axios";

//mistä ottaa datan on tämä url, eri url mihin näyttää
const url=('/api/persons')
//const url=('https://powerful-woodland-97841.herokuapp.com/api/persons')

//määrittele axios käskyt constiin
const getAll=()=>{
    const req= axios.get(url)
    return req.then(response=>response.data)
}
const create = nameObject =>{
    const req=axios.post(url, nameObject)
    return req.then(response=>response.data)
}
const update = (id, nameObject)=>{
    const req=axios.put(`${url}/${id}`, nameObject)
    return req.then(response=>response.data)
}
const toDelete = (id)=>{
    const req=axios.delete(`${url}/${id}`)
    return req.then(response=>response.data)
}
export default { getAll, create, update, toDelete }