import React from 'react';
import { useState } from 'react'


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
  
  const [mostvoted, setMostvoted] = useState(0)


 const voting =()=>{
    const newtable=[...table]
    newtable[selected]+=1
    setTable(newtable)
    if (newtable[selected]>newtable[mostvoted]){
      setMostvoted(selected)
    }
  }

  const setTo=Math.floor(Math.random()*6)
  
  return (
    <div>
      <h1>Anecdotes:</h1>
      <p> {anecdotes[selected]} has {table[selected]} votes</p>
      <button onClick={voting}> vote </button>
      <button onClick={()=>setSelected(setTo)}>next</button>
      <h1>anecdote with most votes</h1>
      <p>{anecdotes[mostvoted]} has {table[mostvoted]} votes</p>
    </div>
  )
}
export default App