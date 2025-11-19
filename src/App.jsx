import { useState } from 'react'
import './App.css'
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router'
import Home from './components/content/Home'
import ReviewPage from './components/content/ReviewPage'
import ReviewByBand from './components/content/ReviewByBand'
import ReviewByVenue from './components/content/ReviewByVenue'
import NaviBar from './NaviBar'

function App() {
  return <HashRouter>
    <NaviBar />
    
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/ReviewPage" element={<ReviewPage/>}></Route>
      <Route path="/ReviewByBand" element={<ReviewByBand/>}></Route>
      <Route path="/ReviewByVenue" element={<ReviewByVenue/>}></Route>
    </Routes>
  </HashRouter>
}

export default App
