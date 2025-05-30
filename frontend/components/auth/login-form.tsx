"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Loader2, Mail, Lock, EyeOff, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, LoginSchemaType } from "@/lib/schemas/authSchemas"


export function LoginForm() {
  const { login, isLoading } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  const [showPassword, setShowPassword] = useState(false)
  const handleLoginSubmit: SubmitHandler<LoginSchemaType> = async (data) => {
    login(data)
  }

  return (
    <Card className="border-gray-700 bg-gray-800/80 backdrop-blur-sm text-white">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl text-blue-300">Iniciar Sesión</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-400">
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(handleLoginSubmit)} >
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="login-email" className="text-xs sm:text-sm text-gray-300">
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
            <Label htmlFor="login-password" className="text-xs sm:text-sm text-gray-300">
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
          <div className="text-right">
            <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs sm:text-sm">
              ¿Olvidaste tu contraseña?
            </Button>
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
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
