"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PasswordInputProps {
  id: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  required = true,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <Lock className="absolute left-2 sm:left-3 top-2 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`pl-8 sm:pl-10 pr-8 sm:pr-10 text-xs sm:text-sm h-8 sm:h-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-500 ${className}`}
        value={value}
        onChange={onChange}
        required={required}
      />
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
  )
}
