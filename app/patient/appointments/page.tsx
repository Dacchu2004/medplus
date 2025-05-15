"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, Plus } from "lucide-react"
import { format } from "date-fns"
import { fetchPatientDashboardData, addAppointment } from "@/lib/api-service"
import { getCurrentUser } from "@/lib/auth-service"

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [newAppointment, setNewAppointment] = useState({
    doctorName: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00 AM",
    type: "Check-up",
    notes: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    const loadAppointments = async () => {
      try {
        const data = await fetchPatientDashboardData()
        setAppointments(data.appointments)
      } catch (error) {
        console.error("Failed to load appointments:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAppointments()
  }, [])

  const handleBookAppointment = async () => {
    try {
      const appointmentData = {
        ...newAppointment,
        patientName: user?.name || "Patient",
        patientId: user?.id || "PAT000",
        status: "Upcoming",
      }

      const result = await addAppointment(appointmentData)
      setAppointments([...appointments, result])

      // Reset form
      setNewAppointment({
        doctorName: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00 AM",
        type: "Check-up",
        notes: "",
      })
    } catch (error) {
      console.error("Failed to book appointment:", error)
    }
  }

  const upcomingAppointments = appointments.filter((appointment) => appointment.status === "Upcoming")

  const pastAppointments = appointments.filter((appointment) => appointment.status === "Completed")

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage your doctor appointments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>Schedule an appointment with a doctor.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select
                    value={newAppointment.doctorName}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, doctorName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Jane Smith">Dr. Jane Smith</SelectItem>
                      <SelectItem value="Dr. Robert Johnson">Dr. Robert Johnson</SelectItem>
                      <SelectItem value="Dr. Emily Davis">Dr. Emily Davis</SelectItem>
                      <SelectItem value="Dr. Michael Wilson">Dr. Michael Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newAppointment.date ? format(new Date(newAppointment.date), "PPP") : "Select a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            setDate(date)
                            setNewAppointment({
                              ...newAppointment,
                              date: date ? format(date, "yyyy-MM-dd") : "",
                            })
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Select
                      value={newAppointment.time}
                      onValueChange={(value) => setNewAppointment({ ...newAppointment, time: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "09:00 AM",
                          "09:30 AM",
                          "10:00 AM",
                          "10:30 AM",
                          "11:00 AM",
                          "11:30 AM",
                          "01:00 PM",
                          "01:30 PM",
                          "02:00 PM",
                          "02:30 PM",
                          "03:00 PM",
                          "03:30 PM",
                          "04:00 PM",
                          "04:30 PM",
                        ].map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Check-up">Check-up</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBookAppointment}>Book Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground">No upcoming appointments. Book one now!</p>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {appointment.date}
                          <Clock className="ml-2 mr-1 h-3 w-3" />
                          {appointment.time}
                        </div>
                        <p className="mt-1 text-sm">{appointment.type}</p>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm" variant="destructive">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="past">
          <Card>
            <CardHeader>
              <CardTitle>Past Appointments</CardTitle>
              <CardDescription>Your appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              {pastAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground">No past appointments.</p>
              ) : (
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">{appointment.doctorName}</p>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {appointment.date}
                          <Clock className="ml-2 mr-1 h-3 w-3" />
                          {appointment.time}
                        </div>
                        <p className="mt-1 text-sm">{appointment.type}</p>
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
