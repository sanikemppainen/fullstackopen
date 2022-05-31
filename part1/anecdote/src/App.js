import React from 'react';
import { useState } from 'react'

const Button=(props)=>(
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
const Anecdote=(props)=>{
  return(
    <p>
      {props.anecdote} : {props.votes} votes
    </p>
  )
}
const Mostvoted=(props)=>{
  return(
    <p>
      Most voted anecdote is:
      <p>
        <Anecdote anecdote ={props.anecdote} votes={props.votes}/>
      </p>
    </p>
  )
}

const App = () => {
  const [selected, setSelected] = useState(0)
  const [table, setTable]=useState(new Array(6).fill(0))
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const vote =()=>{
    const newtable=[...table]
    newtable[selected]+=1
    setTable(newtable)
  }
  const maxVote=table.reduce((a,b,c) => {
    if(b>a.b){
      a.b=b
      a.c=c;
    }return a
    },{b:0}
)
  const mostvotedanecdote=anecdotes[maxVote.c]

  const handleClick=(which)=>{
    switch(which){
      case "change":
        setSelected(Math.floor(Math.random()*6))
        break
      case "vote":
        vote()
        break
      default:
        break
    }
  }
 
  
  return (
    <div>
      <h1>Anecdotes:</h1>
      <Anecdote anecdote={anecdotes[selected]} votes={table[selected]}/>
      <Button onClick={()=>handleClick("change")} text="Change anecdote"/>
      <Button onClick={()=>handleClick("vote")} text="Vote"/>
      <Mostvoted votes={maxVote.c} anecdote={mostvotedanecdote}/>
    </div>
  )
}
export default App