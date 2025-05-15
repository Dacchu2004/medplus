"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { isAuthenticated, getUserRole } from "@/lib/auth-service"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "doctor" | "patient"
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/", "/auth/login", "/first-aid"]
    if (publicRoutes.includes(pathname)) {
      setIsChecking(false)
      return
    }

    const authenticated = isAuthenticated()
    if (!authenticated) {
      router.push("/auth/login")
      return
    }

    if (requiredRole) {
      const userRole = getUserRole()
      if (userRole !== requiredRole) {
        // Redirect to the appropriate dashboard
        router.push(userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard")
        return
      }
    }

    setIsChecking(false)
  }, [pathname, router, requiredRole])

  if (isChecking) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
