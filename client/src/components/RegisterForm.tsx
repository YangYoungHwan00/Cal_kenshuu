import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterForm.module.css'

const RegisterForm = () => {
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
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        navigate('/');

      } else {
        const errorMessages = data.errors ? data.errors.map((err: any) => err.msg).join('\n') : data.message;
        alert("회원가입 실패!\n" + errorMessages);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("회원가입 요청 실패!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>会員登録</h2>
      <input type="text" name="username" placeholder="ユーザー名" onChange={handleChange} />
      <input type="password" name="password" placeholder="パスワード" onChange={handleChange} />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;