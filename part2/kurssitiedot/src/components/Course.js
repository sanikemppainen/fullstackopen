const Header = ({ name }) => <h1>{name}</h1>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ course }) => {
  const total= course.map((part)=>part.exercises).reduce((a,b)=>a+b)
return (
    <div>
      {course.map((part)=> <Part key={part.id} part={part}/>)}
      <strong>Number of exercises: {total} </strong>
    </div>
  )
}

//yksittäisen kurssin muotoilusta huolehtiva komponentti Course
//käyttää header ja content komponentteja
const Course = ({ course }) => <div>
    <Header name = {course.name}/>
    <Content course = {course.parts}/>
    </div>
export default Course