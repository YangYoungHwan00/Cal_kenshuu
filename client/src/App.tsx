import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [msg, setMsg] = useState("")

  useEffect(() => {
    fetch("http://localhost:3000/api/hello")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  return (
    <>
      <div>
        <h1>React + Express test</h1>
        <p>{msg}</p>
      </div>
    </>
  )
}

export default App
