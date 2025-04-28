// Tipo para los favoritos
export interface Favorite {
  id: string
  cityId?: number
  city: string
  country: string
  region: string
}

// Tipo para los elementos del historial
export interface HistoryItem {
  id: string
  cityId?: number
  city: string
  country: string
  region: string
  createdAt: string
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
  id?: number
  name: string
  region: string
  country: string
  tempC: number
  tempF: number
  feelslikeC: number
  feelslikeF: number
  hour: string
  date: string
  condition: string
  humidity: number
  cloud: number
  windKph: number
  isFavorite: boolean
  icon: string
}
