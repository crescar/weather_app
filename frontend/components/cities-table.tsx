"use client"

import type { MajorCity } from "@/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import { WeatherIcon } from "@/components/ui/weather-icon"
import { useWeather } from "@/hooks/use-weather"

interface CitiesTableProps {
  cities: MajorCity[]
  onSelectCity: (cityId: string) => void
}

export function CitiesTable({ cities, onSelectCity }: CitiesTableProps) {
  const { isCelsius, convertTemperature } = useWeather()

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">Principales ciudades del mundo</h2>
      <Card className="bg-gray-800/80 border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-900">
              <TableRow>
                <TableHead className="text-gray-300">Ciudad</TableHead>
                <TableHead className="text-gray-300">Temperatura</TableHead>
                <TableHead className="text-gray-300">Condición</TableHead>
                <TableHead className="text-gray-300">Hora local</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cities.map((city) => (
                <TableRow
                  key={city.id}
                  className="hover:bg-gray-700/50 cursor-pointer transition-colors"
                  onClick={() => onSelectCity(city.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-400 mr-2" />
                      <div>
                        <div>{city.name}</div>
                        <div className="text-xs text-gray-400">{city.country}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-blue-300">
                      {Math.round(convertTemperature(city.weather.temp))}°{isCelsius ? "C" : "F"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <WeatherIcon iconType={city.weather.icon} size="sm" />
                      <span className="ml-2">{city.weather.condition}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(city.timestamp + city.timezone * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
