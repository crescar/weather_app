"use client"

import type { Favorite } from "@/types"
import { useEffect, useState } from "react"
import { showToast } from "nextjs-toast-notify";
import axios from "axios"
import { toast } from "@/components/ui/use-toast"

export function useFavorites() {
  const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/favorites`
  const [favorites, setFavorites] = useState<Favorite[]>([])

  // Cargar favoritos al iniciar
  useEffect(() => {
    fetchFavorites()
  }, [])


  const fetchFavorites= async ()=>{
    try{
      const token = localStorage.getItem("accesToken")
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      setFavorites(response.data.data)
    }catch (error:any) {
      showToast.info(error.response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      showToast.error(error.response.data.error,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }
  }

  const addFavorite = async (
    city: string,
    country: string,
    region: string,
    cityId?: number
  ) => {
    const token = localStorage.getItem("accesToken")
    try {
      const response = await axios.post(baseUrl, {
        city: city,
        country: country,
        region: region,
        cityId: cityId,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      showToast.success(response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }catch (error: any) {
      showToast.info(error.response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      showToast.error(error.response.data.error,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }
    await fetchFavorites()
  }

  const removeFavorite = async (favoriteId: string) => {
    const token = localStorage.getItem("accesToken")
    try {
      const response = await axios.delete(`${baseUrl}/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      showToast.success(response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }catch (error: any) {
      showToast.info(error.response.data.message,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
      showToast.error(error.response.data.error,{
        duration: 4000,
        progress: true,
        position: "top-right",
        transition: "bounceIn",
        icon: '',
        sound: true,
      })
    }
    await fetchFavorites()
  }

  const isFavorite = (city: string, country: string) => {
    return favorites.some((fav) => fav.city === city && fav.country === country)
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    fetchFavorites
  }
}
