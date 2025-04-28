"use client"

import type { HistoryItem } from "@/types"
import { useEffect, useState } from "react"
import { showToast } from "nextjs-toast-notify";

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])

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

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history))
  }, [history])

  const addToHistory = (
    city: string,
    country: string,
    region: string,
    cityId?: number,
  ) => {
    const historyId = `${city}-${country}-${Date.now()}`
    const newHistoryItem: HistoryItem = {
      id: historyId,
      country: country,
      city: city,
      region: region,
      createdAt: new Date().toISOString(),
      ...(cityId ? { cityId } : {}),
    }
    const existingIndex = history.findIndex((item) => (item.city === city && item.country === country) || (item.cityId === cityId))
    const updatedHistory = [...history]
    if (existingIndex !== -1) {
      updatedHistory.splice(existingIndex, 1)
    }
    updatedHistory.unshift(newHistoryItem)
    if (updatedHistory.length > 20) {
      updatedHistory.pop()
    }
    setHistory(updatedHistory)
  }

  const removeHistoryItem = (itemId: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((item) => item.id !== itemId)
      return newHistory
    })
    showToast.success("Busqueda Eliminda del historial", {
      duration: 4000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: '',
      sound: true,
    })
  }

  const clearAllHistory = () => {
    setHistory([])
    showToast.success("Historial de busquedas eliminado", {
      duration: 4000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: '',
      sound: true,
    })
    localStorage.removeItem("weatherHistory")
  }

  return {
    history,
    addToHistory,
    removeHistoryItem,
    clearAllHistory,
  }
}
