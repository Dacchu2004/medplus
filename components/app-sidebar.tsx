"use client"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Calendar, Home, Users, Settings, Heart, MessageSquare, Bell, LogOut } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getCurrentUser, logoutUser } from "@/lib/auth-service"

interface SidebarProps {
  role: "doctor" | "patient"
}

export function AppSidebar({ role }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [unreadCount, setUnreadCount] = useState(3)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    router.push("/auth/login")
  }

  const doctorMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/doctor/dashboard",
    },
    {
      title: "Appointments",
      icon: Calendar,
      path: "/doctor/appointments",
    },
    {
      title: "Patients",
      icon: Users,
      path: "/doctor/patients",
    },
    {
      title: "First Aid",
      icon: Heart,
      path: "/first-aid",
    },
    {
      title: "Emergency Chat",
      icon: MessageSquare,
      path: "/doctor/emergency-chat",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/doctor/settings",
    },
  ]

  const patientMenuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/patient/dashboard",
    },
    {
      title: "Appointments",
      icon: Calendar,
      path: "/patient/appointments",
    },
    {
      title: "Prescriptions",
      icon: Users,
      path: "/patient/prescriptions",
    },
    {
      title: "First Aid",
      icon: Heart,
      path: "/first-aid",
    },
    {
      title: "Emergency Chat",
      icon: MessageSquare,
      path: "/patient/emergency-chat",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/patient/settings",
    },
  ]

  const menuItems = role === "doctor" ? doctorMenuItems : patientMenuItems

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-3">
          <span className="text-xl font-bold text-primary">MediConnect</span>
          <SidebarTrigger className="ml-auto" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => router.push(item.path)}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || "User"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New appointment request</DropdownMenuItem>
                <DropdownMenuItem>New message from Dr. Smith</DropdownMenuItem>
                <DropdownMenuItem>Prescription updated</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
