import React from "react";

const CountriesToShow=({countriesToShow, setFilter})=>{
    console.log('countries to show luokassa: ', countriesToShow)
    
    /*const handleOpening=(event)=>{
        setFilter=(event.target.value)
    }*/

    if (countriesToShow.length>10){
        /* if(filter.lenght===0){
             return(
                 <div>
                     Type to search countries
                 </div>
             )
         }*/
         return(
             <div>
                 too many matches, type more letters
             </div>
         )
     }

    if (countriesToShow.length==1){
        const country=countriesToShow[0]
        return(
            <div>
                <h1>{country.name}</h1>
                Capital: {country.capital}
                <p></p>
                Area: {country.area}
                <p></p>
                Languages:
                <ul>
                {country.languages.map(language=><li>{language.name}</li>)}
                </ul>
                <img src={country.flag} alt={country.name} width='30%'/>
            </div>
        )
    }
    //ylempään myös sää mukaan!

 
    if ((countriesToShow.length>1) && (countriesToShow.length<=10)){
        console.log('välissä')
        return countriesToShow.map(country=>{
                    return(
                    <div>
                    <ul key={country.name}>
                        {country.name} <button value={country.name} onClick={(filter) => setFilter(filter.target.value)}>show more</button>
                    </ul>
                    </div>
                    )
                })
        
    }

 
}
export default CountriesToShow
