"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Loader2, Mail, User, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, RegisterSchemaType } from "@/lib/schemas/authSchemas"

export function RegisterForm() {
  const { singUp, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  // Manejar envío del formulario de registro
  const handleRegisterSubmit: SubmitHandler<RegisterSchemaType> = async (data) => {
    singUp(data)
  }

  return (
    <Card className="border-gray-700 bg-gray-800/80 backdrop-blur-sm text-white">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl text-blue-300">Crear Cuenta</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-400">
          Regístrate para acceder a todas las funciones
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleRegisterSubmit)} >
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="register-name" className="text-xs sm:text-sm text-gray-300">
              Nombre
            </Label>
            <div className="relative">
              <User className="absolute left-2 sm:left-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                name="name"
                type="text"
                placeholder="Tu nombre"
                className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                {...register("name")}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="register-email" className="text-xs sm:text-sm text-gray-300">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-2 sm:left-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="pl-8 sm:pl-10 text-xs sm:text-sm h-8 sm:h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                {...register("email")}
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="register-password" className="text-xs sm:text-sm text-gray-300">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-2 sm:left-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="password"
                className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm h-8 sm:h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                {...register("password")}
              />
              {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="register-confirm-password" className="text-xs sm:text-sm text-gray-300">
              Confirmar Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-2 sm:left-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                name="confirmPassword"
                className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm h-8 sm:h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm h-8 sm:h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear Cuenta
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
