import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Country from './components/Country'
import CountriesToShow from './components/CountriesToShow'

function App() {
  //list of countries and ability to add to that plus filter
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showCountries, setShowCountries] = useState([])

  //vanhempi api restille toimii, 3.1 ei?
  //hae kaikkien maiden tiedot ja aseta ne countries listaan
  useEffect(()=>{
    axios
    .get('https://restcountries.com/v2/all')
    .then((response)=>{
      setCountries(response.data)
      console.log(response.data)
    })
  }, [] )

  const handleFiltering = (event)=>{
    console.log('filter', filter)
    //console.log('annettu', event.target.value)
    setFilter(event.target.value)
  }

  const countriesToShow=countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
  console.log('contries to show: ', countriesToShow)
 
  return (
    <div>
      Find countries:
     <input value={filter} onChange={handleFiltering}></input>
     <CountriesToShow countriesToShow={countriesToShow} setFilter={setFilter}></CountriesToShow>
     
     </div>
  );
}

export default App
/*

      {countriesToShow.map(country=><li key={country.name}>{country.name} {country.capital} {country.area} {country.languages.map(language=><li>{language.name}</li>)}
  </li>)}
      print countries:
      {countries.map(country=><li key={country.name}>{country.name} </li>)}
     ----

      <CountriesToShow countriesToShow={countriesToShow[0]}/>

      <Country countriesToShow={countriesToShow[0]}> </Country>

const handleClick=(event)=>{
   console.log(event.target.value)
   setFilter(event.target.value)
 }

 const filteredCountries = countries.filter(country => country.name.toLowerCase().includes(filter.toLowerCase()))
      <input value={filter} onChange={handleClick}></input>

      <Countries filteredCountries={filteredCountries} setFilter={setFilter}></Countries> 

*/
