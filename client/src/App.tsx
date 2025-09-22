import { useEffect, useState } from 'react'
import './App.css'
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



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
        <main>  
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Router>
        </main>
    </div>
    </>
  )
}

export default App

// import React from 'react';
// import RegisterForm from './components/RegisterForm';
// import LoginForm from './components/LoginForm';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>회원가입 및 로그인 예제</h1>
//       </header>
//       <main style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
//         <RegisterForm />
//         <LoginForm />
//       </main>
//     </div>
//   );
// }

// export default App;