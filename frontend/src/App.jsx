import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Header from './Components/Header'
import SignupForm from './Components/SignupForm'
import LoginForm from './Components/LoginForm'
function App() {

  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<SignupForm/>}/>
      <Route path='/login' element={<LoginForm/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
