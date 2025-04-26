"use client"

import type React from "react"

import { useState } from "react"
import type { Favorite } from "@/types"
import { Star, MapPin, Trash2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

interface FavoritesPanelProps {
  favorites: Favorite[]
  onSelectFavorite: (favorite: Favorite) => void
  onRemoveFavorite: (favoriteId: string) => void
}

export function FavoritesPanel({ favorites, onSelectFavorite, onRemoveFavorite }: FavoritesPanelProps) {
  const [favoriteToDelete, setFavoriteToDelete] = useState<string | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent, favoriteId: string) => {
    e.stopPropagation() // Evitar que se active el favorito al hacer clic en eliminar
    setFavoriteToDelete(favoriteId)
    setIsConfirmDialogOpen(true)
  }

  const confirmDelete = () => {
    if (favoriteToDelete) {
      onRemoveFavorite(favoriteToDelete)
      setFavoriteToDelete(null)
    }
  }

  const closeConfirmDialog = () => {
    setIsConfirmDialogOpen(false)
    setFavoriteToDelete(null)
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-xs sm:text-sm"
          >
            <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-yellow-400" />
            <span className="hidden xs:inline">Favoritos</span>
            {favorites.length > 0 && <Badge className="ml-1 sm:ml-2 bg-blue-600 text-xs">{favorites.length}</Badge>}
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gray-900 border-gray-700 text-gray-100 w-[280px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-blue-300">Destinos favoritos</SheetTitle>
            <SheetDescription className="text-gray-400">Tus ubicaciones guardadas para acceso rápido</SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {favorites.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Star className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                <p>No tienes destinos favoritos guardados</p>
                <p className="text-sm mt-2">Busca una ubicación y guárdala como favorita</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-2">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      onClick={() => onSelectFavorite(favorite)}
                      className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-blue-400 mr-3" />
                        <div>
                          <div className="font-medium">{favorite.city}</div>
                          <div className="text-sm text-gray-400">{favorite.country}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDeleteClick(e, favorite.id)}
                                className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Eliminar de favoritos</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full bg-gray-800 hover:bg-gray-700">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modal de confirmación para eliminar favorito */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar favorito"
        description="¿Estás seguro de que deseas eliminar este destino de tus favoritos? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  )
}
