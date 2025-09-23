import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      alert(data.message);
      navigate('/game');

    } catch (err) {
      console.error("Login failed:", err);
      alert("로그인 요청 실패!");
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>로그인</h2>
      <input type="text" name="username" placeholder="사용자 이름" onChange={handleChange} />
      <input type="password" name="password" placeholder="비밀번호" onChange={handleChange} />
      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;