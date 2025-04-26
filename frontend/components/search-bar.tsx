"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Search, Loader2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { popularCities } from "@/data/mock-data"

interface SearchBarProps {
  onSearch: (city: string) => void
  isLoading?: boolean
}

export function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [city, setCity] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [inputTimeout, setInputTimeout] = useState<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    // Simulación de sugerencias basadas en datos mock
    const mockSuggestions = popularCities.filter((city) => city.toLowerCase().includes(query.toLowerCase()))

    setSuggestions(mockSuggestions)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCity(value)
    setShowSuggestions(true)

    // Clear previous timeout
    if (inputTimeout) clearTimeout(inputTimeout)

    // Set new timeout to avoid too many requests
    const timeout = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)

    setInputTimeout(timeout as unknown as NodeJS.Timeout)
  }

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity)
    onSearch(selectedCity)
    setShowSuggestions(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(city)
    setShowSuggestions(false)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (inputTimeout) clearTimeout(inputTimeout)
    }
  }, [inputTimeout])

  // Close suggestions when clicking outside
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
          <Button type="submit" disabled={isLoading || !city.trim()} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg">
            <Command className="rounded-lg border border-gray-700 bg-gray-800">
              <CommandList>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      onSelect={() => handleSelectCity(suggestion)}
                      className="cursor-pointer hover:bg-gray-700 text-gray-200"
                    >
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {suggestion}
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
