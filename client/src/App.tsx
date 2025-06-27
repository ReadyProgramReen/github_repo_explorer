import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import './App.css'

function App() {

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoginForm  />
      <RegisterForm/>
    </div>
  )
}

export default App
