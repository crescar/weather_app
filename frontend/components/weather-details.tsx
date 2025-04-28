"use client"
import { useState } from "react"
import type { WeatherData } from "@/types"
import { Star, StarOff, Clock, CalendarClock, Cloud, Droplets, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { WeatherIcon } from "@/components/ui/weather-icon"
import { useWeather } from "@/hooks/use-weather"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface WeatherDetailsProps {
  weather: WeatherData | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onAddToFavorites: () => void
}

export function WeatherDetails({
  weather,
  isOpen,
  onOpenChange,
  onAddToFavorites
}: WeatherDetailsProps) {
  const [isCelsius, setIsCelsius] = useState(true)
  if (!weather) return null
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-[90vw] sm:max-w-3xl p-4 sm:p-6">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl sm:text-2xl text-blue-300">
                {weather.name}, {weather.country}
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-lg font-medium text-gray-300">
                {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {!weather.isFavorite && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onAddToFavorites}
                  className="text-yellow-400 hover:bg-gray-700 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:p-2"
                >
                  <Star className="h-4 w-4 sm:mr-1" />
                  <span className="hidden sm:inline">Añadir</span>
                </Button>
              )}
              <div className="p-1 sm:p-2">
                <WeatherIcon weatherData={weather} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center">
              <span className="text-4xl sm:text-6xl font-bold text-blue-300">
                {isCelsius ? weather.tempC : weather.tempF}°{isCelsius ? "C" : "F"}
              </span>
              <div className="ml-2 sm:ml-4 text-xs sm:text-sm text-gray-300">
                <div>
                  Sensación: {isCelsius ? weather.feelslikeC : weather.feelslikeF}°{isCelsius ? "C" : "F"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <span className="text-xs sm:text-sm text-gray-400">°C</span>
              <Switch
                checked={!isCelsius}
                onCheckedChange={(checked) => setIsCelsius(!checked)}
                className="data-[state=checked]:bg-blue-600"
              />
              <span className="text-xs sm:text-sm text-gray-400">°F</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
            <div className="flex items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300 mr-2 sm:mr-3" />
              <div>
                <span className="text-xs sm:text-sm text-gray-400 block">Hora local</span>
                <span className="text-sm sm:font-medium text-white">
                  {weather.hour}
                </span>
              </div>
            </div>
            <div className="flex items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg">
              <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-300 mr-2 sm:mr-3" />
              <div>
                <span className="text-xs sm:text-sm text-gray-400 block">Fecha</span>
                <span className="text-sm sm:font-medium text-white">
                  {new Date(weather.date).toLocaleDateString([], {
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-2 sm:mt-4">
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg">
              <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300 mb-1" />
              <span className="text-xs sm:text-sm text-gray-400">Nubes</span>
              <span className="text-sm sm:font-medium text-white">{weather.cloud}%</span>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg">
              <Droplets className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mb-1" />
              <span className="text-xs sm:text-sm text-gray-400">Humedad</span>
              <span className="text-sm sm:font-medium text-white">{weather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-700/50 rounded-lg">
              <Wind className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mb-1" />
              <span className="text-xs sm:text-sm text-gray-400">Viento</span>
              <span className="text-sm sm:font-medium text-white">{weather.windKph} K/h</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="ghost" className="bg-gray-700 hover:bg-gray-600 text-sm">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
