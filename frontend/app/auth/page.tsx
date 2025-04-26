"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthHeader } from "@/components/auth/auth-header"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-800 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[320px] sm:max-w-md">
        <AuthHeader />

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-gray-700 text-sm">
              Iniciar Sesión
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-gray-700 text-sm">
              Registrarse
            </TabsTrigger>
          </TabsList>

          {/* Formulario de Login */}
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          {/* Formulario de Registro */}
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
