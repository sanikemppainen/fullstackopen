import React from "react";

const PersonsToShow=({personsToShow})=>{
    return(
        <div>
            {personsToShow.map(person=>
                <ul key={person.id}>{person.name} {person.number} </ul>)}
        </div>
    )
}
export default PersonsToShow