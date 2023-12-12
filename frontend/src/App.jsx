import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Header from './Components/Header'
import SignupForm from './Components/SignupForm'
import LoginForm from './Components/LoginForm'
import Verification from './Components/Verification'
import { LoadingProvider } from './Context/LoadingContext'
import ChatRoom from './Pages/ChatRoom';
ChatRoom
function App() {

  return (
    <>
    <BrowserRouter>
    <LoadingProvider>
    <Header/>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/chat/:roomCode' element={<ChatRoom/>}/>
      <Route path='/signup' element={<SignupForm/>}/>
      <Route path='/login' element={<LoginForm/>}/>
      <Route path='/verify/*' element={<Verification/>}/>
    </Routes>

    </LoadingProvider>
    
    </BrowserRouter>
    </>
  )
}

export default App
