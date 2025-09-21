import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [msg, setMsg] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setMsg(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        setLoading(false);
      });
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
