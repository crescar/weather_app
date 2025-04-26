"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "danger" | "warning" | "info"
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: ConfirmationDialogProps) {
  // Definir colores según la variante
  const variantStyles = {
    danger: {
      icon: "text-red-500",
      title: "text-red-500",
      confirmButton: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: "text-amber-500",
      title: "text-amber-500",
      confirmButton: "bg-amber-600 hover:bg-amber-700",
    },
    info: {
      icon: "text-blue-500",
      title: "text-blue-500",
      confirmButton: "bg-blue-600 hover:bg-blue-700",
    },
  }

  const styles = variantStyles[variant]

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader className="flex flex-col items-center text-center">
          <div className="rounded-full bg-gray-700 p-3 mb-4">
            <AlertCircle className={`h-6 w-6 ${styles.icon}`} />
          </div>
          <DialogTitle className={`text-xl ${styles.title}`}>{title}</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button variant="outline" onClick={onClose} className="bg-gray-700 border-gray-600 hover:bg-gray-600">
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} className={styles.confirmButton}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
