import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="doctor">
      <div className="flex min-h-screen">
        <AppSidebar role="doctor" />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AuthGuard>
  )
}
