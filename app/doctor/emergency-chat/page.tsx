"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { fetchPatientList, fetchChatMessages, sendChatMessage, getAIChatResponse } from "@/lib/api-service"
import { getCurrentUser } from "@/lib/auth-service"
import { Send, Phone, Video, FileText, ImageIcon } from "lucide-react"

export default function EmergencyChat() {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    const loadPatients = async () => {
      try {
        const data = await fetchPatientList()
        setPatients(data as any[])
        if (data.length > 0) {
          setSelectedPatient(data[0].id)
        }
      } catch (error) {
        console.error("Failed to load patients:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPatients()
  }, [])

  useEffect(() => {
    if (selectedPatient) {
      const loadMessages = async () => {
        try {
          const data = await fetchChatMessages(selectedPatient)
          setMessages(data as any[])
        } catch (error) {
          console.error("Failed to load messages:", error)
        }
      }

      loadMessages()
    }
  }, [selectedPatient])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedPatient) return

    const message = {
      sender: "doctor",
      senderName: user?.name || "Doctor",
      content: newMessage,
    }

    try {
      const result = await sendChatMessage(selectedPatient, message)
      setMessages([...messages, result])
      setNewMessage("")

      // Simulate AI response if needed
      const aiResponse = await getAIChatResponse(newMessage)
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  const selectedPatientData = patients.find((p) => p.id === selectedPatient)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Emergency Chat</h1>
        <p className="text-muted-foreground">Connect with patients in real-time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Select a patient to chat with</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="online">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="online" className="flex-1">
                  Online
                </TabsTrigger>
                <TabsTrigger value="all" className="flex-1">
                  All
                </TabsTrigger>
              </TabsList>
              <TabsContent value="online">
                <div className="space-y-2">
                  {patients.slice(0, 3).map((patient) => (
                    <Button
                      key={patient.id}
                      variant="ghost"
                      className={`w-full justify-start ${selectedPatient === patient.id ? "bg-primary/10" : ""}`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="flex w-full items-center">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.conditions[0]}</div>
                        </div>
                        <div className="flex h-2 w-2 rounded-full bg-green-500"></div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="all">
                <div className="space-y-2">
                  {patients.map((patient) => (
                    <Button
                      key={patient.id}
                      variant="ghost"
                      className={`w-full justify-start ${selectedPatient === patient.id ? "bg-primary/10" : ""}`}
                      onClick={() => setSelectedPatient(patient.id)}
                    >
                      <div className="flex w-full items-center">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={patient.name} />
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{patient.name}</div>
                          <div className="text-xs text-muted-foreground">{patient.conditions[0]}</div>
                        </div>
                        <div
                          className={`flex h-2 w-2 rounded-full ${
                            patient.id === "PAT001" || patient.id === "PAT002" || patient.id === "PAT003"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="flex flex-col md:col-span-2">
          <CardHeader className="border-b">
            {selectedPatientData ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-2 h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={selectedPatientData.name} />
                    <AvatarFallback>{selectedPatientData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedPatientData.name}</CardTitle>
                    <CardDescription>{selectedPatientData.conditions.join(", ")}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <CardTitle>Select a patient to start chatting</CardTitle>
            )}
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {selectedPatient ? (
              <>
                <div className="h-[calc(100vh-350px)] overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                      >
                        {message.sender !== "doctor" && (
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={message.senderName} />
                            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.sender === "doctor"
                              ? "bg-primary text-primary-foreground"
                              : message.sender === "ai"
                                ? "bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100"
                                : "bg-muted"
                          }`}
                        >
                          {message.sender === "ai" && (
                            <Badge className="mb-1" variant="outline">
                              AI Assistant
                            </Badge>
                          )}
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className="mt-1 text-right text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {message.sender === "doctor" && (
                          <Avatar className="ml-2 h-8 w-8">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={message.senderName} />
                            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <Button size="icon" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-muted-foreground">
                  Select a patient from the list to start a conversation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
