"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Pill, Activity, Download } from "lucide-react"
import { getCurrentUser } from "@/lib/auth-service"
import { fetchPatientDashboardData } from "@/lib/api-service"

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    const loadDashboardData = async () => {
      try {
        const data = await fetchPatientDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  useEffect(() => {
    if (dashboardData && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set canvas dimensions
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        // Draw blood pressure chart
        drawChart(
          ctx,
          dashboardData.vitalsData.bloodPressure,
          "Blood Pressure",
          "rgb(239, 68, 68)",
          0,
          canvas.height / 3,
        )

        // Draw heart rate chart
        drawChart(
          ctx,
          dashboardData.vitalsData.heartRate,
          "Heart Rate",
          "rgb(59, 130, 246)",
          canvas.height / 3,
          canvas.height / 3,
        )

        // Draw blood sugar chart
        drawChart(
          ctx,
          dashboardData.vitalsData.bloodSugar,
          "Blood Sugar",
          "rgb(16, 185, 129)",
          (canvas.height / 3) * 2,
          canvas.height / 3,
        )
      }
    }
  }, [dashboardData])

  const drawChart = (
    ctx: CanvasRenderingContext2D,
    data: any[],
    label: string,
    color: string,
    yOffset: number,
    height: number,
  ) => {
    if (!data || data.length === 0) return

    const canvas = ctx.canvas
    const width = canvas.width

    // Find min and max values
    const values = data.map((item) => item.value)
    const min = Math.min(...values) * 0.9
    const max = Math.max(...values) * 1.1

    // Draw label
    ctx.font = "14px Arial"
    ctx.fillStyle = color
    ctx.fillText(label, 10, yOffset + 20)

    // Draw chart
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 2

    const xStep = width / (data.length - 1)

    data.forEach((item, index) => {
      const x = index * xStep
      const normalizedValue = (item.value - min) / (max - min)
      const y = yOffset + height - normalizedValue * (height - 40) - 10

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw points
    data.forEach((item, index) => {
      const x = index * xStep
      const normalizedValue = (item.value - min) / (max - min)
      const y = yOffset + height - normalizedValue * (height - 40) - 10

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()
    })
  }

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
        <h1 className="text-3xl font-bold">Welcome, {user?.name || "Patient"}</h1>
        <p className="text-muted-foreground">Here's an overview of your health information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.upcomingAppointments || 2}</div>
            <p className="text-xs text-muted-foreground">
              Next: {dashboardData?.appointments?.[0]?.date || "2023-06-15"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.prescriptions || 3}</div>
            <p className="text-xs text-muted-foreground">
              Last updated: {dashboardData?.prescriptionList?.[0]?.date || "2023-05-10"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.messages || 1}</div>
            <p className="text-xs text-muted-foreground">From: Dr. Jane Smith</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Good</div>
            <p className="text-xs text-muted-foreground">Based on your recent vitals</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Health Vitals</CardTitle>
            <CardDescription>Your health metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <canvas ref={canvasRef} className="h-full w-full"></canvas>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData?.appointments || [])
                .filter((apt: any) => apt.status === "Upcoming")
                .map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {appointment.date} - {appointment.time}
                      </div>
                      <p className="text-xs text-muted-foreground">{appointment.type}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                ))}
              <Button className="w-full" variant="outline">
                Book New Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Prescriptions</CardTitle>
            <CardDescription>Your active medications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(dashboardData?.prescriptionList || []).map((prescription: any) => (
                <div key={prescription.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{prescription.name}</p>
                    <p className="text-sm font-medium">${prescription.cost.toFixed(2)}</p>
                  </div>
                  <p className="text-sm">
                    {prescription.dosage} - {prescription.frequency}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Prescribed by: {prescription.prescribedBy}</span>
                    <span>{prescription.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Health Summary</CardTitle>
            <CardDescription>Download or print your health records</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full sm:w-auto">
              <Download className="mr-2 h-4 w-4" />
              Download Summary
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full bg-red-500 hover:bg-red-600">
          Emergency Help
        </Button>
      </div>
    </div>
  )
}
