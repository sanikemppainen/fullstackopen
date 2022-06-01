import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import PersonsToShow from './components/PersonsToShow'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', id:'1', number: '0401231244'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) =>{
    event.preventDefault()

    const exists = persons.some(person=>person.name === newName)
    if (exists){
      alert(newName +' is already added to phonebook')
    } else {
      const nameObject = {
      name : newName,
      id : persons.length+1,
      number : newNumber,
      }
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameAdding = (event) =>{
    setNewName(event.target.value)
  }
  const handleNumberAdding = (event) =>{
    setNewNumber(event.target.value)
  }
  const handleFiltering = (event) =>{
    setNewFilter(event.target.value)
  }


  const personsToShow = newFilter === '' ? persons : persons.filter(person=> person["name"].toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(()=>{
    axios
      .get('http://localhost:3001/persons')
      .then(response=>{
        setPersons(response.data)
      })
  }, [] )
    
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} handleFiltering={handleFiltering}/>
      <Person 
      newName={newName}
      handleNameAdding={handleNameAdding}
      newNumber={newNumber}
      handleNumberAdding={handleNumberAdding}
      submit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonsToShow personsToShow={personsToShow}/>
    </div>
  )

}

export default App