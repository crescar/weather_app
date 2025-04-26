import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const country = searchParams.get("country") || ""
  const state = searchParams.get("state") || ""

  if (!city) {
    return NextResponse.json({ message: "El parámetro 'city' es requerido" }, { status: 400 })
  }

  try {
    // Construir la consulta con los parámetros adicionales
    let searchQuery = city

    if (state) {
      searchQuery += `, ${state}`
    }

    if (country) {
      searchQuery += `, ${country}`
    }

    // Aquí normalmente usarías una API key real de OpenWeatherMap
    const API_KEY = process.env.OPENWEATHER_API_KEY || "tu_api_key"
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(searchQuery)}&units=metric&lang=es&appid=${API_KEY}`,
    )

    if (!response.ok) {
      const errorData = await response.json()
      if (response.status === 404) {
        return NextResponse.json({ message: "Ciudad no encontrada" }, { status: 404 })
      }
      throw new Error(errorData.message || "Error en la API del clima")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching weather data:", error)
    return NextResponse.json({ message: "Error al obtener datos del clima" }, { status: 500 })
  }
}
