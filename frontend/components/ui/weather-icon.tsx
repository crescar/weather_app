import { Cloud, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSnow, CloudSun, Moon, Sun } from "lucide-react"
import type { WeatherData } from "@/types"
import { useWeather } from "@/hooks/use-weather"

interface WeatherIconProps {
  weatherData?: WeatherData
  iconType?: string
  size?: "sm" | "md" | "lg"
}

export function WeatherIcon({ weatherData, iconType, size = "lg" }: WeatherIconProps) {
  const { isNightTime } = useWeather()

  // Tamaños de iconos según el prop size
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
  }

  // Si se proporciona un tipo de icono específico (para ciudades principales)
  if (iconType) {
    switch (iconType) {
      case "rain":
        return <CloudRain className={`${iconSizes[size]} text-blue-400`} />
      case "cloud":
        return <Cloud className={`${iconSizes[size]} text-gray-400`} />
      case "cloud-sun":
        return <CloudSun className={`${iconSizes[size]} text-gray-400`} />
      case "cloud-fog":
        return <CloudFog className={`${iconSizes[size]} text-gray-400`} />
      case "cloud-snow":
        return <CloudSnow className={`${iconSizes[size]} text-blue-200`} />
      case "cloud-lightning":
        return <CloudLightning className={`${iconSizes[size]} text-yellow-400`} />
      case "sun":
        return <Sun className={`${iconSizes[size]} text-yellow-400`} />
      default:
        return <Sun className={`${iconSizes[size]} text-yellow-400`} />
    }
  }

  // Si no hay datos del clima, mostrar un icono predeterminado
  if (!weatherData) {
    return <Moon className={`${iconSizes[size]} text-blue-300`} />
  }

  // Determinar el icono basado en los datos del clima
  const condition = weatherData.weather[0].main.toLowerCase()
  const isNight = isNightTime(weatherData.sys.sunrise, weatherData.sys.sunset, weatherData.dt)

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return <CloudRain className={`${iconSizes[size]} text-blue-400`} />
  } else if (condition.includes("cloud")) {
    return isNight ? (
      <CloudMoon className={`${iconSizes[size]} text-gray-400`} />
    ) : (
      <Cloud className={`${iconSizes[size]} text-gray-400`} />
    )
  } else {
    return isNight ? (
      <Moon className={`${iconSizes[size]} text-blue-300`} />
    ) : (
      <Sun className={`${iconSizes[size]} text-yellow-400`} />
    )
  }
}
