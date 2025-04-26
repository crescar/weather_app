"use client"

import { useState, useEffect } from "react"
import { Cloud } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { majorCitiesData } from "@/data/mock-data"
import type { MajorCity } from "@/types"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
import { useHistory } from "@/hooks/use-history"
import { useWeather } from "@/hooks/use-weather"
import { LoadingScreen } from "@/components/loading-screen"
import { SearchBar } from "@/components/search-bar"
import { CitiesTable } from "@/components/cities-table"
import { FavoritesPanel } from "@/components/favorites-panel"
import { HistoryPanel } from "@/components/history-panel"
import { WeatherDetails } from "@/components/weather-details"
import { UserMenu } from "@/components/user-menu"
import { WeatherIcon } from "@/components/ui/weather-icon"

export default function WeatherApp() {
  const { user, isLoading, logout } = useAuth()
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { history, addToHistory, removeHistoryItem, clearAllHistory } = useHistory()
  const { city, setCity, weather, loading, error, fetchWeather } = useWeather()

  const [majorCities, setMajorCities] = useState<MajorCity[]>(majorCitiesData)
  const [showWeatherModal, setShowWeatherModal] = useState(false)
  const [showQuickAddFavorite, setShowQuickAddFavorite] = useState(false)
  const [currentIsFavorite, setCurrentIsFavorite] = useState(false)

  // Actualizar la hora de las ciudades principales cada minuto
  useEffect(() => {
    if (!user) return

    const intervalId = setInterval(() => {
      setMajorCities((cities) =>
        cities.map((city) => ({
          ...city,
          timestamp: Date.now(),
        })),
      )
    }, 60000)

    return () => clearInterval(intervalId)
  }, [user])

  // Verificar si la ubicación actual es favorita
  useEffect(() => {
    if (weather) {
      const isCurrentLocationFavorite = isFavorite(weather.name, weather.sys.country)
      setCurrentIsFavorite(isCurrentLocationFavorite)
      setShowQuickAddFavorite(!isCurrentLocationFavorite)
    } else {
      setCurrentIsFavorite(false)
      setShowQuickAddFavorite(false)
    }
  }, [weather, isFavorite])

  const handleSearch = (cityName: string) => {
    setCity(cityName)
    fetchWeather(cityName, (data) => {
      // Callback cuando se obtiene el clima exitosamente
      setShowWeatherModal(true)
      // Agregar a historial
      addToHistory(data.name, null, null, data.sys.country)
    })
  }

  const handleSelectCity = (cityId: string) => {
    const city = majorCities.find((c) => c.id === cityId)
    if (city) {
      setCity(city.name)
      fetchWeather(city.name, () => setShowWeatherModal(true))
    }
  }

  const handleSelectFavorite = (favorite: (typeof favorites)[0]) => {
    fetchWeather(favorite.city, () => setShowWeatherModal(true))
    setCity(favorite.city)
  }

  const handleSelectHistoryItem = (item: (typeof history)[0]) => {
    fetchWeather(item.city, () => setShowWeatherModal(true))
    setCity(item.city)
  }

  const handleAddToFavorites = () => {
    if (!weather) return
    addFavorite(weather.name, weather.sys.country)
    setCurrentIsFavorite(true)
    setShowQuickAddFavorite(false)
  }

  const handleRemoveFromFavorites = () => {
    if (!weather) return

    // Encontrar el ID del favorito actual
    const favoriteToRemove = favorites.find((fav) => fav.city === weather.name && fav.country === weather.sys.country)

    if (favoriteToRemove) {
      removeFavorite(favoriteToRemove.id)
      setCurrentIsFavorite(false)
      setShowQuickAddFavorite(true)
    }
  }

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 p-2 sm:p-4 md:p-8 text-gray-100">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Encabezado */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300 mr-1 sm:mr-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-blue-300">Clima App</h1>
          </div>

          {user && <UserMenu user={user} onLogout={logout} />}
        </div>

        {/* Título central */}
        <div className="text-center">
          <div className="flex justify-center mb-2 sm:mb-4">
            <WeatherIcon weatherData={weather} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-300">Consulta el clima</h2>
          <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">Información meteorológica en tiempo real</p>
        </div>

        {/* Sección de búsqueda */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-200">Buscar ubicación</h2>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <FavoritesPanel
              favorites={favorites}
              onSelectFavorite={handleSelectFavorite}
              onRemoveFavorite={(favoriteId) => removeFavorite(favoriteId)}
            />

            <HistoryPanel
              history={history}
              onSelectHistoryItem={handleSelectHistoryItem}
              onRemoveHistoryItem={(itemId) => removeHistoryItem(itemId)}
              onClearHistory={clearAllHistory}
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Buscador de ciudad */}
          <SearchBar onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Tabla de ciudades principales */}
        <CitiesTable cities={majorCities} onSelectCity={handleSelectCity} />

        {error && (
          <Alert variant="destructive" className="animate-fadeIn bg-red-900 border-red-800 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Modal de detalles del clima */}
        <WeatherDetails
          weather={weather}
          isOpen={showWeatherModal}
          onOpenChange={setShowWeatherModal}
          isFavorite={currentIsFavorite}
          onAddToFavorites={handleAddToFavorites}
          onRemoveFromFavorites={handleRemoveFromFavorites}
          showQuickAddFavorite={showQuickAddFavorite}
        />
      </div>
    </main>
  )
}
