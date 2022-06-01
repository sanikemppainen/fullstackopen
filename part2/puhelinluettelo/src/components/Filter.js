import React from "react";

const Filter = (props) =>{
    return(
        <div>
            filter by name:
            <input value={props.newFilter} onChange={props.handleFiltering}></input>
        </div>
    )
}
export default Filter