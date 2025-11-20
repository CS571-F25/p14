import { useState } from 'react'
import './App.css'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router'
import Home from './components/content/Home'
import ReviewPage from './components/content/ReviewPage'
import ReviewByBand from './components/content/ReviewByBand'
import ReviewByVenue from './components/content/ReviewByVenue'
import UserLogin from './components/auth/UserLogin'
import UserRegister from './components/auth/UserRegister'
import NaviBar from './NaviBar'

//troubleshooting, delete this comment later

function App() {
  return <HashRouter>
    <NaviBar />

    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/ReviewPage" element={<ReviewPage/>}></Route>
      <Route path="/ReviewByBand" element={<ReviewByBand/>}></Route>
      <Route path="/ReviewByVenue" element={<ReviewByVenue/>}></Route>
      <Route path="/UserLogin" element={<UserLogin/>}></Route>
      <Route path="/UserRegister" element={<UserRegister/>}></Route>
    </Routes>
  </HashRouter>
}

export default App
