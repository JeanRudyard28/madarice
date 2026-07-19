import { createContext, useContext, useState } from "react"
import {
  getCurrentUser,
  loginUser,
  registerUser,
  logoutUser,
} from "../lib/storage"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser())

  const login = ({ email, password }) => {
    const loggedUser = loginUser({ email, password })
    setUser(loggedUser)
    return loggedUser
  }

  const register = ({ name, email, password }) => {
    const newUser = registerUser({ name, email, password })
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider")
  return ctx
}
