import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Admin from './pages/Admin'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path='/signup' element={<Signup/>} />
        
        <Route path='/login' element={<Login/>} />
        <Route path='/admin' element={<Admin/>} />
        <Route path='*' element={<NoPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App