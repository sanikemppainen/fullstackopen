import React from 'react';

const Header =({course})=>{
  return(
    <div>
      <h1>{course.name}</h1>
    </div>
  )
}
const Part=({part, exercise})=>{
  return(
    <div>
      <p>{part} {exercise}</p>
    </div>
  )
}

const Content=({course})=>{
  let parts=course["parts"]
  const[one, two, three]=parts
  return(
    <div>
      <Part part= {one.name} exercise={one.exercises}/>
      <Part part={two.name} exercise={two.exercises}/>
      <Part part={three.name} exercise={three.exercises}/>
    </div>
  )
}

const Total=({course})=>{
  let total=course.parts[0].exercises+course.parts[1].exercises+course.parts[2].exercises
  return(
    <div>
      <p>Number of exercises {total}</p>
    </div>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  return (
    <div>
      <Header course={course}/>
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App;
