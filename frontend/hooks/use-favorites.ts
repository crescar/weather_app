"use client"

import type { Favorite } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  // Cargar favoritos al iniciar
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (e) {
        console.error("Error loading favorites:", e)
      }
    }
  }, [])

  // Guardar favoritos cuando cambien
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (city: string, country: string) => {
    // Crear un ID único para el favorito
    const favoriteId = `${city}-${country}-${Date.now()}`

    // Crear el objeto favorito
    const newFavorite: Favorite = {
      id: favoriteId,
      city,
      state: null,
      country,
      countryCode: null,
      countryName: null,
    }

    // Añadir a la lista de favoritos
    setFavorites((prev) => [...prev, newFavorite])

    // Mostrar notificación
    toast({
      title: "Añadido a favoritos",
      description: `${city} ha sido añadido a tus favoritos`,
    })

    return true
  }

  const removeFavorite = (favoriteId: string) => {
    // Encontrar el favorito para mostrar su nombre en la notificación
    const favoriteToRemove = favorites.find((fav) => fav.id === favoriteId)

    setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId))

    if (favoriteToRemove) {
      toast({
        title: "Eliminado de favoritos",
        description: `${favoriteToRemove.city} ha sido eliminado de tus favoritos`,
      })
    }
  }

  const isFavorite = (city: string, country: string) => {
    return favorites.some((fav) => fav.city === city && fav.country === country)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  }
}
