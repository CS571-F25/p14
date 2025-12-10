import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/content/Home'
import ReviewPage from './components/content/ReviewPage'
import ReviewByBand from './components/content/ReviewByBand'
import ReviewByVenue from './components/content/ReviewByVenue'
import UserLogin from './components/auth/UserLogin'
import UserRegister from './components/auth/UserRegister'
import UserProfile from './components/content/UserProfile'
import NaviBar from './NaviBar'
import { AuthProvider } from './components/auth/AuthContext'

function App() {
  return (
    <AuthProvider>
        <NaviBar />

        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/ReviewPage" element={<ReviewPage/>}></Route>
          <Route path="/ReviewByBand" element={<ReviewByBand/>}></Route>
          <Route path="/ReviewByVenue" element={<ReviewByVenue/>}></Route>
          <Route path="/UserLogin" element={<UserLogin/>}></Route>
          <Route path="/UserRegister" element={<UserRegister/>}></Route>
          <Route path="/UserProfile" element={<UserProfile/>}></Route>

        </Routes>  
    </AuthProvider>
  )
}

export default App