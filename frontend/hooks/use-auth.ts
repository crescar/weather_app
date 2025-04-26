"use client"

import type { UserType } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { LoginSchemaType, RegisterSchemaType } from "@/lib/schemas/authSchemas"


export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("weatherAppUser")
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser) as UserType
          if (userData.isAuthenticated) {
            setUser(userData)
            setIsLoading(false)
            return
          }
        } catch (e) {
          console.error("Error parsing user data:", e)
        }
      }


      router.push("/auth")
    }
    const timer = setTimeout(checkAuth, 500)
    return () => clearTimeout(timer)
  }, [])

  const login = (userData: LoginSchemaType) => {

    setIsLoading(true)
    const authUser: UserType = {
      ...userData,
      isAuthenticated: true,
    }

    localStorage.setItem("weatherAppUser", JSON.stringify(authUser))
    setUser(authUser)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }
    , 2000)
    
  }

  const logout = () => {
    localStorage.removeItem("weatherAppUser")
    setUser(null)
    router.push("/login")
  }

  const singUp = (userData: RegisterSchemaType) => {

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }
    , 1000)

    const authUser: UserType = {
      ...userData,
      isAuthenticated: true,
    }
    localStorage.setItem("weatherAppUser", JSON.stringify(authUser))
    setUser(authUser)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }
    , 2000)
  }

  return {
    user,
    isLoading,
    login,
    logout,
    singUp,
    isAuthenticated: !!user?.isAuthenticated,
  }
}
