import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Home from "./Pages/Home";
import Login from './Components/GoogleSSO/Login';
function App() {

  return (
    <>
      <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App
