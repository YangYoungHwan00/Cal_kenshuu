import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginForm.module.css'

const LoginForm = () => {

  let cur_user_name : string = "";
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
      cur_user_name = data.user.username;
      alert(cur_user_name+"さん ようこそ！");
      navigate('/game');

    } catch (err) {
      console.error("Login failed:", err);
      alert("로그인 요청 실패!");
      navigate('/login');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <input type="text" name="username" placeholder="ユーザー名" onChange={handleChange} />
      <input type="password" name="password" placeholder="パスワード" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;