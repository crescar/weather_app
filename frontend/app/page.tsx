"use client"
import { useEffect } from "react"
import { Cloud } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
import { useHistory } from "@/hooks/use-history"
import { useWeather } from "@/hooks/use-weather"
import { LoadingScreen } from "@/components/loading-screen"
import { SearchBar } from "@/components/search-bar"
import { FavoritesPanel } from "@/components/favorites-panel"
import { HistoryPanel } from "@/components/history-panel"
import { WeatherDetails } from "@/components/weather-details"
import { UserMenu } from "@/components/user-menu"
import { WeatherIcon } from "@/components/ui/weather-icon"
import { Favorite, HistoryItem } from '../types/index';

export default function WeatherApp() {
  const { user, isLoading, logout } = useAuth()
  const { favorites, addFavorite, removeFavorite } = useFavorites()
  const { history, removeHistoryItem, clearAllHistory, addToHistory } = useHistory()
  const {
    setCity,
    weather,
    fetchWeather,
    openWeatherDetails,
    setOpenWeatherDetails,
    loading,
    setWeather
  } = useWeather()

  const handleSearchCity = async (city: string, id?: number) => {
    const response: any = await fetchWeather(city, id)
    addToHistory(
      response.name,
      response.country,
      response.region,
      id,
    )
  }

  const handleSelectFavorite = async (favorite: Favorite) => {
    favorite.cityId ? await fetchWeather(`id:${favorite.cityId}`) : await fetchWeather(favorite.city)
    setCity(favorite.city)
  }

  const handleSelectHistoryItem = async (history: HistoryItem) => {
    history.cityId ? await fetchWeather(`id:${history.cityId}`) : await fetchWeather(history.city)
    setCity(history.city)
  }

  const handleAddToFavorites = () => {
    if (!weather) return
    addFavorite(
      weather.name,
      weather.country,
      weather.region,
      weather.id
    )
    setWeather({
      ...weather,
      isFavorite: true,
    })
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 p-2 sm:p-4 md:p-8 text-gray-100">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">

        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Cloud className="h-6 w-6 sm:h-8 sm:w-8 text-blue-300 mr-1 sm:mr-2" />
            <h1 className="text-xl sm:text-2xl font-bold text-blue-300">Clima App</h1>
          </div>

          {user && <UserMenu user={user} onLogout={logout} />}
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2 sm:mb-4">
            <WeatherIcon />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-300">Consulta el clima</h2>
          <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">Información meteorológica en tiempo real</p>
        </div>


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
          <SearchBar searchCity={handleSearchCity} loading={loading} />
        </div>

        {/* Modal de detalles del clima */}
        <WeatherDetails
          weather={weather}
          isOpen={openWeatherDetails}
          onOpenChange={setOpenWeatherDetails}
          onAddToFavorites={handleAddToFavorites}
        />
      </div>
    </main>
  )
}
