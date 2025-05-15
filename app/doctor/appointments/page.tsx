"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { CalendarIcon, Clock, Download, Plus, Search } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fetchDoctorAppointments, fetchPatientList, addAppointment } from "@/lib/api-service"

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState<any[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "09:00",
    type: "Check-up",
    notes: "",
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointmentsData, patientsData] = await Promise.all([fetchDoctorAppointments(), fetchPatientList()])
        setAppointments(appointmentsData as any[])
        setPatients(patientsData as any[])
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleAddAppointment = async () => {
    try {
      const patient = patients.find((p) => p.id === newAppointment.patientId)
      const appointmentData = {
        ...newAppointment,
        patientName: patient?.name || "Unknown Patient",
      }

      const result = await addAppointment(appointmentData)
      setAppointments([...appointments, result])
      setIsDialogOpen(false)
      setNewAppointment({
        patientId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        type: "Check-up",
        notes: "",
      })
    } catch (error) {
      console.error("Failed to add appointment:", error)
    }
  }

  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      appointment.patientName.toLowerCase().includes(searchLower) ||
      appointment.type.toLowerCase().includes(searchLower) ||
      appointment.date.includes(searchTerm)
    )
  })

  const todayAppointments = filteredAppointments.filter(
    (appointment) => appointment.date === format(new Date(), "yyyy-MM-dd"),
  )

  const upcomingAppointments = filteredAppointments.filter((appointment) => new Date(appointment.date) > new Date())

  const pastAppointments = filteredAppointments.filter((appointment) => new Date(appointment.date) < new Date())

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
          <p className="text-muted-foreground">Manage your patient appointments</p>
        </div>
        <div className="mt-4 flex gap-2 sm:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
                <DialogDescription>Create a new appointment for a patient.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="patient">Patient</Label>
                  <Select
                    value={newAppointment.patientId}
                    onValueChange={(value) => setNewAppointment({ ...newAppointment, patientId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.name}
                        </SelectItem>
                      ))}
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
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Add any notes about the appointment"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAppointment}>Save Appointment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Schedule
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="today">
        <TabsList className="mb-4">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Appointments scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground">No appointments scheduled for today.</p>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          <div
                            className={`mr-2 h-2 w-2 rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-500"
                                : appointment.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="ml-2 text-sm text-muted-foreground">({appointment.patientId})</p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {appointment.time} - {appointment.type}
                        </div>
                        {appointment.notes && <p className="mt-1 text-sm">{appointment.notes}</p>}
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Future scheduled appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground">No upcoming appointments.</p>
              ) : (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          <div
                            className={`mr-2 h-2 w-2 rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-500"
                                : appointment.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="ml-2 text-sm text-muted-foreground">({appointment.patientId})</p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {appointment.date} {appointment.time} - {appointment.type}
                        </div>
                        {appointment.notes && <p className="mt-1 text-sm">{appointment.notes}</p>}
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">View Details</Button>
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
              <CardDescription>Previous appointments</CardDescription>
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
                        <p className="font-medium">{appointment.patientName}</p>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {appointment.date} {appointment.time} - {appointment.type}
                        </div>
                        {appointment.notes && <p className="mt-1 text-sm">{appointment.notes}</p>}
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
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Appointments</CardTitle>
              <CardDescription>Complete appointment history</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground">No appointments found.</p>
              ) : (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col justify-between rounded-lg border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <div className="flex items-center">
                          <div
                            className={`mr-2 h-2 w-2 rounded-full ${
                              appointment.status === "Confirmed"
                                ? "bg-green-500"
                                : appointment.status === "Pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          ></div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="ml-2 text-sm text-muted-foreground">({appointment.patientId})</p>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-muted-foreground">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {appointment.date} {appointment.time} - {appointment.type}
                        </div>
                        {appointment.notes && <p className="mt-1 text-sm">{appointment.notes}</p>}
                      </div>
                      <div className="mt-4 flex gap-2 sm:mt-0">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
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
