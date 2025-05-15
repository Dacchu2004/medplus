import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requiredRole="patient">
      <div className="flex min-h-screen">
        <AppSidebar role="patient" />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </AuthGuard>
  )
}
