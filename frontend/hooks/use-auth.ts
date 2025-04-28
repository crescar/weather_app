"use client"

import type { UserType } from "@/types"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { LoginSchemaType, RegisterSchemaType } from "@/lib/schemas/authSchemas"
import { showToast } from "nextjs-toast-notify";
import axios from "axios"

export function useAuth() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth`
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("weatherAppUser")
    const token = localStorage.getItem("accesToken")
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser)
      setUser({
        email: parsedUser.email,
        name: parsedUser.name,
        isAuthenticated: true,
      })
    }
  }, [])

  const login = async (userData: LoginSchemaType) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/login`, userData)
      const message = response.data.message
      const data = response.data.data
      localStorage.setItem("accesToken", data.token)
      localStorage.setItem("weatherAppUser", JSON.stringify({
        email: data.email,
        name: data.name,
      }))
      document.cookie = `weatherAppUser=${JSON.stringify(data)}; path=/; SameSite=Strict; Secure`
      setUser({
        email: data.email,
        name: data.name,
        isAuthenticated: true,
      })
      setIsLoading(false)
      showToast.success(message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      router.push("/")
    }catch (error:any) {
      setIsLoading(false)
      showToast.info(error.response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      showToast.error(error.response.data.error,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("weatherAppUser")
    localStorage.removeItem("accesToken")
    document.cookie = "weatherAppUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure"
    showToast.success("Logout exitoso",{
      duration: 4000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: '',
      sound: true,
    })
    router.push("/auth")
  }

  const singUp = async (userData: RegisterSchemaType) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/register`, userData)
      const message = response.data.message
      const data = response.data.data
      localStorage.setItem("accesToken", data.token)
      localStorage.setItem("weatherAppUser", JSON.stringify({
        email: data.email,
        name: data.name,
      }))
      document.cookie = `weatherAppUser=${JSON.stringify(data)}; path=/; SameSite=Strict; Secure`
      setUser({
        email: data.email,
        name: data.name,
        isAuthenticated: true,
      })
      setIsLoading(false)
      showToast.success(message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      router.push("/")
    } catch (error:any) {
      setIsLoading(false)
      showToast.info(error.response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      showToast.error(error.response.data.error,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }
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
