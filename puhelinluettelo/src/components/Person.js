import React from "react";

const Person = (props)=>{
    return(
        <form onSubmit={props.submit}>
          <p></p>
          <div>Name:
          <input value={props.newName} onChange={props.handleNameAdding}/>
          </div>
          <p></p>
          <div>Number:
          <input value={props.newNumber} onChange={props.handleNumberAdding}></input>
          </div>
          <p></p>
          <button type="submit">add to phonebook</button>
        </form>
    )
}
export default Person