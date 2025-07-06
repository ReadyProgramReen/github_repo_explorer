import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Dashboard from './components/Dashboard';
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Profile from './components/Profile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

// const [showLogin,setShowLogin] = useState(true);

  return (
    <div className='app-container'>
 
    <BrowserRouter>
      <Routes>
        <Route path= "/" element={<Navigate to ="/login"/>}/>
        <Route path="/login" element={<LoginForm/>}/>
        <Route path="/register" element={<RegisterForm/>}/>

      {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute> }/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute> }/>
       
        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFound/>}/>


      </Routes>
    </BrowserRouter>

    </div>
  )
}

export default App
