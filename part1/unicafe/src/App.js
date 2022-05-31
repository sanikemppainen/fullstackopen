import React from 'react';
import { useState } from 'react';

const Button=(b)=>(
  <button onClick={b.onClick}>
    {b.text}
  </button>
)

const StatisticLine=(statsB)=>{
  return(
    <tr>
      <p>{statsB.name} {statsB.value}</p>
    </tr>
  )
}

const Statistics=(statsB)=>{
  if(!statsB.isClicked){
    return <p>No feedback has been given yet</p>
  } else {
      return(
        <div>
        <h3>Statistics on votes</h3>
        <table>
          <tbody>
            <StatisticLine name="good" value={statsB.good}/>
            <StatisticLine name="neutral" value={statsB.neutral}/>
            <StatisticLine name="bad" value={statsB.bad}/>
            <StatisticLine name="total" value={statsB.total}/>
            <StatisticLine name="average" value={(statsB.good-statsB.bad)/statsB.total}/>
            <StatisticLine name="percPos" value={statsB.percPos + "%"}/>
          </tbody>
        </table>  
      </div>
      )
  }
  
}

const App = () => {
  // save buttons to their own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [isClicked, setIsClicked] = useState(false)
  let total=good+neutral+bad
  

  const getWAverage=(weightsarray, total)=>{
    const weights=weightsarray.reduce((w, i)=>{
      return w+i.number+i.weight}, 0)
      let average=weights/total
      return average
  }
  const average=getWAverage(
    [
      {
        number: good, weight:1
      },{
        number: neutral, weight:0
      },{
        number: bad, weight:-1
      }
    ], total
  )
  const percPos=good/total*100
  
  
  //when clicked, check which button and change value accordingly
  const handleClick=(which)=>{
    setIsClicked(true)
//    console.log(isClicked)
    switch (which) {
      case "good":
        setGood(good+1);
        break;
      case "neutral":
        setNeutral(neutral+1);
        break;
      case "bad":
        setBad(bad+1);
        break;
      default:
        break;
    }
  }
  const statsB={
    good:good,
    neutral:neutral,
    bad:bad,
    total:total,
    average:average,
    percPos:percPos,
    isClicked:isClicked,
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={()=> handleClick("good")} text="good"/>
      <Button onClick={()=> handleClick("neutral")} text="neutral"/>
      <Button onClick={()=> handleClick("bad")} text="bad"/>
      <Statistics {...statsB} />

    </div>
  )
}

export default App