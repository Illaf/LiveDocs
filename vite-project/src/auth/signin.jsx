// Login.js
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
   
      try {
        const response= await axios.post('http://localhost:3001/auth/login',{
          username,
          password
        })
        const {token,documentId}= response.data;
      localStorage.setItem('user', JSON.stringify({ token }));
      navigate(`/documents/${documentId}`); // Redirect to the home page or editor
    } catch (error) {
      console.error("Login failed:", error);
    }


  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

}
export default Login;
