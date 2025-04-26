import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-gray-300">Cargando aplicación...</p>
      </div>
    </div>
  )
}
