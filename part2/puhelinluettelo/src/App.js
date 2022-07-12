import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import PersonsToShow from './components/PersonsToShow'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', id:'1', number: '0401231244'}
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [error, setError] = useState(null)
  const [redError, setRedError]= useState(false)

  const addPerson = (event) =>{
    event.preventDefault()

    const exists = persons.some(person=>person.name === newName)
    if (exists){
      if(window.confirm(`${newName} is already added to the phonebook, do you want to replace the old number with the new one?`)){
        const person= persons.find(person=>person.name===newName)
        const numberChangedPerson= { ...person, number: newNumber}
        personService
          .update(numberChangedPerson.id, numberChangedPerson)
          .then(returned=>{
            setPersons(persons.map(p=>p.name !== newName? p : numberChangedPerson))
            //alert(`number updated`)
            setRedError(false)
            setError('Number updated')
            setTimeout(()=>{
              setError(null)
            }, 4000)
          })
      } else {
        setNewName('')
        setNewNumber('')
        return
      }
    } else {
      const nameObject = {
      name : newName,
//      id : persons.length+1, älä lisää tässä id, muuten poiston jälkeen ei voi tehdä samalle id:lle uutta
      number : newNumber,
      }
      /*palvelimelle uuden hlön lähettäessä/talletettaessa vain tämä tarvitaan:
      axios
        .post('http://localhost:3001/persons', nameObject)
        .then(response=>{
          console.log(response.data)
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })  */
        //käytä personServiceä palvelimen kanssa kommunikointiin, korvaa ylemmän
        personService
          .create(nameObject)
          .then(returnedPerson=>{
            setPersons(persons.concat(returnedPerson))
            setNewName('')
            setNewNumber('')
            console.log(returnedPerson)
            setRedError(false)
            setError('Person added')
            setTimeout(()=>{
              setError(null)
            }, 4000)
          }).catch(error=>{
            setRedError(true)
            console.log('frontissa', error.response.data)
            
            setError(`couldn't create a person: ${error.reponse.data.error}`)
            setTimeout(()=>{
              setError(null)
            }, 4000)
          })
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
  const handleDeleting=(person)=>{
    //jos true niin poista person
    if (window.confirm(`sure you want to delete ${person.name}?`)){
      personService
      .toDelete(person.id)
      .then(returnedPerson=>{
        setPersons(persons.filter(i=>i.id !== person.id))
        console.log(`deleted ${person.name}`)
        setRedError(false)
        setError('Person deleted')
        setTimeout(()=>{
          setError(null)
        }, 4000)
      })
      .catch(error=>{
        console.log(`couldn't delete ${person.name} maybe already deleted`)
        setPersons(persons.filter(i=>i.id !== person.id))
        setRedError(true)
        setError('Person already deleted')
        setTimeout(()=>{
          setError(null)
        }, 4000)
      })
    }

  }

  const Notification=({ message, redError })=>{
    const errorStyle={
      color: redError ? 'red' : 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    }
    if (message=== null){
      return null
    } else{
      return <div style={errorStyle}>
        {message}
      </div>
    }
  }

  const personsToShow = newFilter === '' ? persons : persons.filter(person=> person["name"].toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(()=>{
    personService
      .getAll()
      .then(initialPeople=>{
        setPersons(initialPeople)
      })
  }, [] )
    
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={error} redError={redError}/>
      <Filter value={newFilter} handleFiltering={handleFiltering}/>
      <Person 
      newName={newName}
      handleNameAdding={handleNameAdding}
      newNumber={newNumber}
      handleNumberAdding={handleNumberAdding}
      submit={addPerson}
      />
      <h2>Numbers</h2>
      <PersonsToShow personsToShow={personsToShow} handleDeleting={handleDeleting}/>
    </div>
  )

}

export default App