import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import TextEditor from './components/TextEditor';
import SignUp from './auth/signup';
import SignIn from './auth/signin';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/document/${uuidv4()}`);
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/document/:id" element={<TextEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
