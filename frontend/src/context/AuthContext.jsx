import { createContext, useState } from 'react'
import { logout as logoutUser } from '../services/authService'

const AuthContext = createContext()

function AuthProvider({ children }) {
    const [user, setUser] = useState(null)

    const login = (userData) => {
        setUser(userData)
    }

    const logout = async () => {
        try {
            await logoutUser()
        } catch (error) {
            console.error('LOGOUT ERROR:', error)
        } finally {
            setUser(null)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthContext,
    AuthProvider
}