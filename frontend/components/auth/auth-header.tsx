import { Cloud } from "lucide-react"

export function AuthHeader() {
  return (
    <div className="text-center mb-4 sm:mb-8">
      <div className="flex justify-center mb-2 sm:mb-4">
        <Cloud className="h-12 w-12 sm:h-16 sm:w-16 text-blue-300" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-300">Clima App</h1>
      <p className="text-sm sm:text-base text-gray-300 mt-1 sm:mt-2">Tu portal meteorológico personal</p>
    </div>
  )
}
