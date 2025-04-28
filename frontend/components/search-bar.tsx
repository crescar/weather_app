"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { useWeather } from "@/hooks/use-weather"

interface SearchBarProps {
  searchCity: (city: string, id?: number) => void
  loading?: boolean
}

interface CitySuggestion {
  id: number
  name: string
  country: string
  region: string
}

export function SearchBar({ searchCity, loading }: SearchBarProps) {
  const { autocompleteCities } = useWeather()
  const [city, setCity] = useState("")
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }
    const getSuggestions = await autocompleteCities(query)
    setSuggestions(getSuggestions)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCity(value)
    setShowSuggestions(true)
    if (inputTimeout) clearTimeout(inputTimeout)
    const timeout = setTimeout(() => {
      fetchSuggestions(value)
    }, 500)
    setInputTimeout(timeout as unknown as NodeJS.Timeout)
  }

  const handleSelectCity = (selectedCity: string, name: string) => {
    setCity(name)
    searchCity(selectedCity, +(selectedCity.split(":")[1]))
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchCity(city)
    setShowSuggestions(false)
  }

  useEffect(() => {
    return () => {
      if (inputTimeout) clearTimeout(inputTimeout)
    }
  }, [inputTimeout])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-2">
      <Label htmlFor="city-input">Ciudad</Label>
      <div className="relative" ref={inputRef}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            id="city-input"
            type="text"
            placeholder="Buscar ciudad..."
            value={city}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
          <Button type="submit" disabled={loading || !city.trim()} className="bg-blue-600 hover:bg-blue-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <Command className="rounded-lg border border-gray-700 bg-gray-800">
              <CommandList>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.id}
                      onSelect={() => handleSelectCity(`id:${suggestion.id}`, suggestion.name)}
                      className="cursor-pointer hover:bg-gray-700 text-gray-200"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {`${suggestion.name}, ${suggestion.country} - ${suggestion.region}`}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    </div>
  )
}
