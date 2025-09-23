import { use, useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoute';



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
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
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