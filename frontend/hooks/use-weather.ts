"use client"

import { useState } from "react"
import type { WeatherData } from "@/types"
import { showToast } from "nextjs-toast-notify";
import axios from "axios"

export function useWeather() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/weather`
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCelsius, setIsCelsius] = useState(true)
  const [openWeatherDetails, setOpenWeatherDetails] = useState(false)

  const fetchWeather = async (cityName: string = city, id?:number) => {
    if (!cityName.trim()) return
    setLoading(true)
    const token = localStorage.getItem("accesToken")
    try {
      const response:any = await axios.get(baseUrl, {
        params: {
          city: cityName,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      showToast.success(response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      setLoading(false)
      setWeather({
        ...response.data.data,
        ...(id ? { id } : {}),
      })
      setOpenWeatherDetails(true)
      return response.data.data
    } catch (error: any) {
      setLoading(false)
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

  const convertTemperature = (temp: number, toCelsius: boolean = isCelsius) => {
    if (toCelsius) {
      return temp
    } else {
      return (temp * 9) / 5 + 32
    }
  }

  const autocompleteCities = async (query: string) => {
    const token = localStorage.getItem("accesToken")
    try{
      const response:any = await axios.get(`${baseUrl}/autocomplete`, {
        params: {
          query,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      return response.data.data
    } catch (error:any) {
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
    city,
    setCity,
    weather,
    loading,
    isCelsius,
    setIsCelsius,
    fetchWeather,
    convertTemperature,
    autocompleteCities,
    openWeatherDetails,
    setOpenWeatherDetails,
    setWeather
  }
}
