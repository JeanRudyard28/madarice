import { createContext, useContext, useState } from "react"
import {
  getCurrentUser,
  clearCurrentUser,
} from "../lib/storage"
import { loginBackend, signupBackend } from "../lib/api"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser())

  const login = async ({ email, password }) => {
    const response = await loginBackend(email, password)
    const session = response.session
    const supabaseUser = response.user

    const loggedUser = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.email.split('@')[0],
      token: session.access_token
    }

    localStorage.setItem("racine_user", JSON.stringify(loggedUser))
    setUser(loggedUser)
    return loggedUser
  }

  const register = async ({ name, email, password }) => {
    const response = await signupBackend(email, password)
    let loggedUser

    if (response.session) {
      const session = response.session
      const supabaseUser = response.user
      loggedUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: name || supabaseUser.email.split('@')[0],
        token: session.access_token
      }
    } else {
      // Auto login if no session was returned by signup
      const loginResponse = await loginBackend(email, password)
      const session = loginResponse.session
      const supabaseUser = loginResponse.user
      loggedUser = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: name || supabaseUser.email.split('@')[0],
        token: session.access_token
      }
    }

    localStorage.setItem("racine_user", JSON.stringify(loggedUser))
    setUser(loggedUser)
    return loggedUser
  }

  const logout = () => {
    clearCurrentUser()
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
