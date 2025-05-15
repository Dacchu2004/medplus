"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Download, Plus, Mic, MicOff } from "lucide-react"
import {
  fetchPatientDetails,
  addPatientNote,
  addPatientVitals,
  addPrescription,
  transcribeAudio,
} from "@/lib/api-service"
import { getCurrentUser } from "@/lib/auth-service"

export default function PatientDetails() {
  const params = useParams()
  const patientId = params.id as string
  const [patient, setPatient] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [newNote, setNewNote] = useState("")
  const [newVitals, setNewVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    bloodSugar: "",
    weight: "",
    height: "",
  })
  const [newPrescription, setNewPrescription] = useState({
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  })
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [isTranscribing, setIsTranscribing] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    const loadPatientDetails = async () => {
      try {
        const data = await fetchPatientDetails(patientId)
        setPatient(data)
      } catch (error) {
        console.error("Failed to load patient details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPatientDetails()
  }, [patientId])

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      const note = {
        content: newNote,
        author: user?.name || "Doctor",
      }

      const result = await addPatientNote(patientId, note)
      setPatient({
        ...patient,
        notes: [result, ...patient.notes],
      })
      setNewNote("")
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }

  const handleAddVitals = async () => {
    try {
      const result = await addPatientVitals(patientId, newVitals)
      setPatient({
        ...patient,
        vitals: [result, ...patient.vitals],
      })
      setNewVitals({
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        respiratoryRate: "",
        bloodSugar: "",
        weight: "",
        height: "",
      })
    } catch (error) {
      console.error("Failed to add vitals:", error)
    }
  }

  const handleAddPrescription = async () => {
    try {
      const prescription = {
        ...newPrescription,
        prescribedBy: user?.name || "Doctor",
      }

      const result = await addPrescription(patientId, prescription)
      setPatient({
        ...patient,
        medications: [result, ...patient.medications],
      })
      setNewPrescription({
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      })
    } catch (error) {
      console.error("Failed to add prescription:", error)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setIsTranscribing(true)

      // Simulate transcription with OpenAI API
      try {
        // In a real app, we would send the audio to the OpenAI API
        // Here we're simulating the response
        const result = await transcribeAudio(new Blob())
        setTranscription(result.text)

        // Add the transcription as a note
        const note = {
          content: result.text,
          author: user?.name || "Doctor",
        }

        const noteResult = await addPatientNote(patientId, note)
        setPatient({
          ...patient,
          notes: [noteResult, ...patient.notes],
        })
      } catch (error) {
        console.error("Failed to transcribe audio:", error)
      } finally {
        setIsTranscribing(false)
      }
    } else {
      // Start recording
      setIsRecording(true)
      setTranscription("")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center">
          <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Patient Not Found</h1>
        </div>
        <p className="mt-4">
          The patient you are looking for does not exist or you do not have permission to view their details.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center">
        <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{patient.name}</h1>
          <p className="text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Summary
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Age</p>
                <p>
                  {patient.age} years ({patient.dob})
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p>{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Contact</p>
                <p>{patient.phone}</p>
                <p className="text-sm">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p>{patient.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
                <p>{patient.emergencyContact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Insurance</p>
                <p>{patient.insurance}</p>
                <p className="text-sm">ID: {patient.insuranceId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Blood Type</p>
                <p>{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Allergies</p>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.map((allergy: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Medical Conditions</p>
                <div className="flex flex-wrap gap-1">
                  {patient.conditions.map((condition: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Medical Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notes">
              <TabsList className="mb-4">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="visits">Visit History</TabsTrigger>
              </TabsList>

              <TabsContent value="notes">
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <Label htmlFor="new-note">Add Note</Label>
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                      disabled={isTranscribing}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="mr-2 h-4 w-4" />
                          Stop Recording
                        </>
                      ) : isTranscribing ? (
                        "Transcribing..."
                      ) : (
                        <>
                          <Mic className="mr-2 h-4 w-4" />
                          Voice Note
                        </>
                      )}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="mb-2 rounded-md bg-red-100 p-2 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
                      Recording... Speak clearly into your microphone.
                    </div>
                  )}
                  <Textarea
                    id="new-note"
                    placeholder="Enter your notes here..."
                    className="mb-2"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button onClick={handleAddNote}>Add Note</Button>
                </div>
                <div className="space-y-4">
                  {patient.notes.map((note: any, index: number) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium">{note.author}</p>
                        <p className="text-sm text-muted-foreground">{note.date}</p>
                      </div>
                      <p className="whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="vitals">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Vitals
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Vitals</DialogTitle>
                      <DialogDescription>Record the patient's vital signs.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="blood-pressure">Blood Pressure</Label>
                          <Input
                            id="blood-pressure"
                            placeholder="e.g., 120/80"
                            value={newVitals.bloodPressure}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                bloodPressure: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                          <Input
                            id="heart-rate"
                            type="number"
                            placeholder="e.g., 72"
                            value={newVitals.heartRate}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                heartRate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="temperature">Temperature (°F)</Label>
                          <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 98.6"
                            value={newVitals.temperature}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                temperature: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="respiratory-rate">Respiratory Rate</Label>
                          <Input
                            id="respiratory-rate"
                            type="number"
                            placeholder="e.g., 16"
                            value={newVitals.respiratoryRate}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                respiratoryRate: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="blood-sugar">Blood Sugar</Label>
                          <Input
                            id="blood-sugar"
                            type="number"
                            placeholder="e.g., 100"
                            value={newVitals.bloodSugar}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                bloodSugar: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="weight">Weight (lbs)</Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="e.g., 150"
                            value={newVitals.weight}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                weight: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="height">Height (ft.in)</Label>
                          <Input
                            id="height"
                            placeholder="e.g., 5.10"
                            value={newVitals.height}
                            onChange={(e) =>
                              setNewVitals({
                                ...newVitals,
                                height: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddVitals}>Save Vitals</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>BP</TableHead>
                        <TableHead>HR</TableHead>
                        <TableHead>Temp</TableHead>
                        <TableHead>Resp</TableHead>
                        <TableHead>Blood Sugar</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Height</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.vitals.map((vital: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{vital.date}</TableCell>
                          <TableCell>{vital.bloodPressure}</TableCell>
                          <TableCell>{vital.heartRate}</TableCell>
                          <TableCell>{vital.temperature}</TableCell>
                          <TableCell>{vital.respiratoryRate}</TableCell>
                          <TableCell>{vital.bloodSugar}</TableCell>
                          <TableCell>{vital.weight}</TableCell>
                          <TableCell>{vital.height}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="medications">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mb-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Prescription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Prescription</DialogTitle>
                      <DialogDescription>Prescribe a new medication for the patient.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="medication-name">Medication Name</Label>
                        <Input
                          id="medication-name"
                          placeholder="e.g., Amoxicillin"
                          value={newPrescription.name}
                          onChange={(e) =>
                            setNewPrescription({
                              ...newPrescription,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            placeholder="e.g., 500mg"
                            value={newPrescription.dosage}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                dosage: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="frequency">Frequency</Label>
                          <Input
                            id="frequency"
                            placeholder="e.g., Twice daily"
                            value={newPrescription.frequency}
                            onChange={(e) =>
                              setNewPrescription({
                                ...newPrescription,
                                frequency: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          placeholder="e.g., 7 days"
                          value={newPrescription.duration}
                          onChange={(e) =>
                            setNewPrescription({
                              ...newPrescription,
                              duration: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddPrescription}>Save Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div className="space-y-4">
                  {patient.medications.map((medication: any, index: number) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-muted-foreground">{medication.startDate || medication.date}</p>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Dosage</p>
                          <p>{medication.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                          <p>{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p>{medication.duration}</p>
                        </div>
                      </div>
                      {medication.prescribedBy && (
                        <p className="mt-2 text-sm text-muted-foreground">Prescribed by: {medication.prescribedBy}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="visits">
                <div className="space-y-4">
                  {patient.visits.map((visit: any, index: number) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{visit.reason}</p>
                        <p className="text-sm text-muted-foreground">{visit.date}</p>
                      </div>
                      <div className="mt-2 space-y-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Diagnosis</p>
                          <p>{visit.diagnosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Treatment</p>
                          <p>{visit.treatment}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                          <p>{visit.doctor}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
