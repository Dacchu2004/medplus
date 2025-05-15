"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, Pill, Clock, Calendar } from "lucide-react"
import { fetchPatientDashboardData } from "@/lib/api-service"

export default function PatientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const data = await fetchPatientDashboardData()
        setPrescriptions(data.prescriptionList)
      } catch (error) {
        console.error("Failed to load prescriptions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPrescriptions()
  }, [])

  const calculateTotalCost = () => {
    return prescriptions.reduce((total, prescription) => total + prescription.cost, 0)
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground">Manage your medications</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Prescriptions
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prescriptions.length}</div>
            <p className="text-xs text-muted-foreground">Last updated: {prescriptions[0]?.date || "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Next Refill</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">For: {prescriptions[0]?.name || "N/A"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalCost().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For all current medications</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
          <CardDescription>All your prescribed medications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              <div className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="rounded-lg border p-4">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">{prescription.name}</h3>
                          <Badge className="ml-2">{prescription.dosage}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {prescription.frequency} for {prescription.duration}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <p className="text-lg font-bold">${prescription.cost.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col justify-between border-t pt-4 sm:flex-row sm:items-center">
                      <div className="text-sm text-muted-foreground">
                        Prescribed by {prescription.prescribedBy} on {prescription.date}
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <Button size="sm" variant="outline">
                          Request Refill
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Medication</TableHead>
                      <TableHead>Dosage</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Prescribed By</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescriptions.map((prescription) => (
                      <TableRow key={prescription.id}>
                        <TableCell className="font-medium">{prescription.name}</TableCell>
                        <TableCell>{prescription.dosage}</TableCell>
                        <TableCell>{prescription.frequency}</TableCell>
                        <TableCell>{prescription.duration}</TableCell>
                        <TableCell>{prescription.prescribedBy}</TableCell>
                        <TableCell>{prescription.date}</TableCell>
                        <TableCell className="text-right">${prescription.cost.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={6} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">${calculateTotalCost().toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
