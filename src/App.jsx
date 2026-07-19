import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './page/LandingPage'
import ChatPage from './page/ChatPage'
import LoginPage from './page/LoginPage'
import RegisterPage from './page/RegisterPage'
import ProfilePage from './page/ProfilePage'

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
