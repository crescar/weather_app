// Tipo para los favoritos
export interface Favorite {
  id: string
  city: string
  state: string | null
  country: string | null
  countryCode: string | null
  countryName: string | null
}

// Tipo para los elementos del historial
export interface HistoryItem {
  id: string
  city: string
  state: string | null
  country: string | null
  countryCode: string | null
  countryName: string | null
  timestamp: number
}

// Tipo para las ciudades principales
export interface MajorCity {
  id: string
  name: string
  country: string
  countryCode: string
  weather: {
    temp: number
    condition: string
    icon: string
    humidity: number
    windSpeed: number
  }
  timezone: number
  timestamp: number
}

// Tipo para el usuario
export interface UserType {
  name?: string
  email: string
  isAuthenticated: boolean
}

// Tipo para los datos del clima
export interface WeatherData {
  coord: {
    lon: number
    lat: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
  rain?: {
    "1h"?: number
    "3h"?: number
  }
}
