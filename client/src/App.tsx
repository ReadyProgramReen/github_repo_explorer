import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './components/Dashboard';
import './App.css'
// import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


function App() {

// const [showLogin,setShowLogin] = useState(true);

  return (
    <div className='app-container'>
 
    <BrowserRouter>
      <Routes>
        <Route path= "/" element={<Navigate to ="/login"/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>

      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
