import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/Signin'
import Profile from './pages/Profile'
import About from './pages/About'
import SignUp from './pages/SIgnUp'


function App() {
  return <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Home/>}/>
      <Route path ="/sign-in" element={<SignIn/>}/>
      <Route path = "/sign-up" element={<SignUp/>}/>
      <Route path = "/profile" element ={<Profile/>}/>
      <Route path = "/about" element ={<About/>}/>
      
    </Routes>
  </BrowserRouter>
}

export default App