"use client"

import type { HistoryItem } from "@/types"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

  // Cargar historial al iniciar
  useEffect(() => {
    const savedHistory = localStorage.getItem("weatherHistory")
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error("Error loading history:", e)
      }
    }
  }, [])

  // Guardar historial cuando cambie
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history))
  }, [history])

  const addToHistory = (
    cityName: string,
    countryCode: string | null,
    stateValue: string | null,
    countryShortCode: string,
  ) => {
    // Crear un ID único para el elemento del historial
    const historyId = `${cityName}-${countryShortCode}-${Date.now()}`

    // Crear el objeto de historial
    const newHistoryItem: HistoryItem = {
      id: historyId,
      city: cityName,
      state: stateValue,
      country: countryShortCode,
      countryCode: countryCode,
      countryName: null,
      timestamp: Date.now(),
    }

    // Verificar si ya existe una entrada similar en el historial
    const existingIndex = history.findIndex((item) => item.city === cityName && item.country === countryShortCode)

    // Crear una copia del historial actual
    const updatedHistory = [...history]

    // Si existe, eliminar la entrada anterior
    if (existingIndex !== -1) {
      updatedHistory.splice(existingIndex, 1)
    }

    // Añadir la nueva entrada al principio
    updatedHistory.unshift(newHistoryItem)

    // Limitar el historial a 20 elementos
    if (updatedHistory.length > 20) {
      updatedHistory.pop()
    }

    // Actualizar el estado
    setHistory(updatedHistory)
  }

  const removeHistoryItem = (itemId: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== itemId)
      return newHistory
    })

    toast({
      title: "Elemento eliminado",
      description: "Se ha eliminado el elemento del historial",
    })
  }

  const clearAllHistory = () => {
    setHistory([])
    toast({
      title: "Historial borrado",
      description: "Se ha eliminado todo el historial de búsquedas",
    })
  }

  return {
    history,
    addToHistory,
    removeHistoryItem,
    clearAllHistory,
  }
}
