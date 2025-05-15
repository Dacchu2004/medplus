"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, Activity } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-service"
import { fetchDoctorDashboardData } from "@/lib/api-service"

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    const loadDashboardData = async () => {
      try {
        const data = await fetchDoctorDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name || "Doctor"}</h1>
        <p className="text-muted-foreground">Here's an overview of your practice today</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.todayAppointments || 8}</div>
            <p className="text-xs text-muted-foreground">{dashboardData?.appointmentChange || "+2"} from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Consultations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.pendingConsultations || 4}</div>
            <p className="text-xs text-muted-foreground">{dashboardData?.consultationChange || "-1"} from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalPatients || 145}</div>
            <p className="text-xs text-muted-foreground">{dashboardData?.patientChange || "+5"} new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Emergency Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.emergencyRequests || 2}</div>
            <p className="text-xs text-muted-foreground">{dashboardData?.emergencyChange || "+1"} from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your upcoming appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                dashboardData?.todaySchedule || [
                  {
                    id: 1,
                    patientName: "John Doe",
                    time: "09:00 AM",
                    type: "Check-up",
                    status: "Confirmed",
                  },
                  {
                    id: 2,
                    patientName: "Jane Smith",
                    time: "10:30 AM",
                    type: "Follow-up",
                    status: "Confirmed",
                  },
                  {
                    id: 3,
                    patientName: "Robert Johnson",
                    time: "01:00 PM",
                    type: "Consultation",
                    status: "Pending",
                  },
                  {
                    id: 4,
                    patientName: "Emily Davis",
                    time: "03:30 PM",
                    type: "Check-up",
                    status: "Confirmed",
                  },
                ]
              ).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{appointment.patientName}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {appointment.time} - {appointment.type}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        appointment.status === "Confirmed" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    ></div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Activity</CardTitle>
            <CardDescription>Latest updates from your patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(
                dashboardData?.recentActivity || [
                  {
                    id: 1,
                    patientName: "Sarah Wilson",
                    action: "Updated health vitals",
                    time: "2 hours ago",
                  },
                  {
                    id: 2,
                    patientName: "Michael Brown",
                    action: "Requested prescription refill",
                    time: "4 hours ago",
                  },
                  {
                    id: 3,
                    patientName: "Lisa Taylor",
                    action: "Booked an appointment",
                    time: "Yesterday",
                  },
                  {
                    id: 4,
                    patientName: "David Miller",
                    action: "Sent a message",
                    time: "Yesterday",
                  },
                ]
              ).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{activity.patientName}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
