import React from "react";

const PersonsToShow=({personsToShow, handleDeleting})=>{
    return(
        <div>
            {personsToShow.map(person=>
                <ul key={person.id}>
                    {person.name} {person.number}
                    <button onClick={() =>handleDeleting(person)}>delete</button>
                </ul>)}

        </div>
    )
}
export default PersonsToShow