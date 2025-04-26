"use client"

import { useState } from "react"
import { mockWeatherData } from "@/data/mock-data"
import type { WeatherData } from "@/types"


export function useWeather() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCelsius, setIsCelsius] = useState(true)

  const fetchWeather = async (cityName: string = city, onSuccess?: (data: WeatherData) => void) => {
    if (!cityName.trim()) return

    setLoading(true)
    setError("")

    try {
      // Simulación de respuesta con datos mock
      let mockData = null

      const cityLower = cityName.toLowerCase()

      if (cityLower.includes("madrid")) {
        mockData = mockWeatherData.madrid
      } else if (cityLower.includes("barcelona")) {
        mockData = mockWeatherData.barcelona
      } else if (cityLower.includes("nueva york") || cityLower.includes("new york")) {
        mockData = mockWeatherData.newyork
      } else if (cityLower.includes("mexico") || cityLower.includes("méxico")) {
        mockData = mockWeatherData.mexico
      } else if (cityLower.includes("buenos aires")) {
        mockData = mockWeatherData.buenosaires
      } else {
        // Si no coincide con ninguna ciudad mock, usar Madrid como fallback
        mockData = { ...mockWeatherData.madrid }
        mockData.name = cityName
        // Actualizar algunos valores para que parezca diferente
        mockData.main.temp = Math.round(15 + Math.random() * 15)
        mockData.main.feels_like = mockData.main.temp - 1 + Math.random() * 2
        mockData.main.humidity = Math.round(40 + Math.random() * 40)
        mockData.wind.speed = Math.round(10 * (1 + Math.random() * 5)) / 10
        mockData.dt = Math.floor(Date.now() / 1000)
      }

      // Actualizar la hora actual
      mockData.dt = Math.floor(Date.now() / 1000)

      // Simular un retraso para que parezca una llamada real
      setTimeout(() => {
        setWeather(mockData)
        setLoading(false)
        onSuccess?.(mockData)
      }, 800)
    } catch (err) {
      setError("Error al obtener datos del clima. Intente con otra ciudad.")
      setWeather(null)
      setLoading(false)
    }
  }

  const convertTemperature = (temp: number, toCelsius: boolean = isCelsius) => {
    if (toCelsius) {
      return temp
    } else {
      return (temp * 9) / 5 + 32
    }
  }

  const isNightTime = (sunrise: number, sunset: number, current: number) => {
    return current < sunrise || current > sunset
  }

  return {
    city,
    setCity,
    weather,
    loading,
    error,
    isCelsius,
    setIsCelsius,
    fetchWeather,
    convertTemperature,
    isNightTime,
  }
}
