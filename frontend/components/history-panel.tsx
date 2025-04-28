"use client"

import type React from "react"

import { useState } from "react"
import type { HistoryItem } from "@/types"
import { History, X, ChevronRight } from "lucide-react"
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


interface HistoryPanelProps {
  history: HistoryItem[]
  onSelectHistoryItem: (item: HistoryItem) => void
  onRemoveHistoryItem: (itemId: string) => void
  onClearHistory: () => void
}

export function HistoryPanel({ history, onSelectHistoryItem, onRemoveHistoryItem, onClearHistory }: HistoryPanelProps) {
  const [historyItemToDelete, setHistoryItemToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation() // Evitar que se active el elemento al hacer clic en eliminar
    setHistoryItemToDelete(itemId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (historyItemToDelete) {
      onRemoveHistoryItem(historyItemToDelete)
      setHistoryItemToDelete(null)
    }
  }

  const handleClearClick = () => {
    setIsClearDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false)
    setHistoryItemToDelete(null)
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
            <History className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-400" />
            <span className="hidden xs:inline">Historial</span>
            {history.length > 0 && <Badge className="ml-1 sm:ml-2 bg-blue-600 text-xs">{history.length}</Badge>}
          </Button>
        </SheetTrigger>
        <SheetContent className="bg-gray-900 border-gray-700 text-gray-100 w-[280px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="text-blue-300">Historial de búsquedas</SheetTitle>
            <SheetDescription className="text-gray-400">Tus consultas recientes de clima</SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            {history.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <History className="h-12 w-12 mx-auto mb-2 text-gray-600" />
                <p>No hay búsquedas recientes</p>
                <p className="text-sm mt-2">Las ubicaciones que busques aparecerán aquí</p>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearClick}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Borrar todo
                  </Button>
                </div>
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onSelectHistoryItem(item)}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center">
                          <History className="h-5 w-5 text-blue-400 mr-3" />
                          <div>
                            <div className="font-medium">{item.city}</div>
                            <div className="text-sm text-gray-400">{item.country}</div>
                            <div className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => handleDeleteClick(e, item.id)}
                                  className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Eliminar del historial</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <ChevronRight className="h-5 w-5 text-gray-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>

          <SheetFooter className="mt-6">
            <SheetClose asChild>
              <Button className="w-full bg-gray-800 hover:bg-gray-700">Cerrar</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Modal de confirmación para eliminar elemento del historial */}
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Eliminar del historial"
        description="¿Estás seguro de que deseas eliminar esta búsqueda del historial?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Modal de confirmación para limpiar todo el historial */}
      <ConfirmationDialog
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        onConfirm={onClearHistory}
        title="Borrar todo el historial"
        description="¿Estás seguro de que deseas borrar todo tu historial de búsquedas? Esta acción no se puede deshacer."
        confirmText="Borrar todo"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  )
}
