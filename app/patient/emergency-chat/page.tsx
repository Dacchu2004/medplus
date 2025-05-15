"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchChatMessages, sendChatMessage, getAIChatResponse } from "@/lib/api-service"
import { getCurrentUser } from "@/lib/auth-service"
import { Send, ImageIcon, FileText, AlertTriangle } from "lucide-react"

export default function PatientEmergencyChat() {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isOnline, setIsOnline] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    // Randomly determine if doctor is online
    setIsOnline(Math.random() > 0.5)

    const loadMessages = async () => {
      try {
        const data = await fetchChatMessages("PAT001")
        setMessages(data as any[])
      } catch (error) {
        console.error("Failed to load messages:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const message = {
      sender: "patient",
      senderName: user?.name || "Patient",
      content: newMessage,
    }

    try {
      const result = await sendChatMessage("PAT001", message)
      setMessages([...messages, result])
      setNewMessage("")

      // If doctor is offline, get AI response
      if (!isOnline) {
        const aiResponse = await getAIChatResponse(newMessage)
        setMessages((prev) => [...prev, aiResponse])
      } else {
        // Simulate doctor response after a delay
        setTimeout(async () => {
          const doctorResponse = {
            id: Math.floor(Math.random() * 1000),
            sender: "doctor",
            senderName: "Dr. Jane Smith",
            content:
              "Thank you for your message. I'll review your symptoms and get back to you shortly. In the meantime, please rest and stay hydrated.",
            timestamp: new Date().toISOString(),
          }
          setMessages((prev) => [...prev, doctorResponse])
        }, 5000)
      }
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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Emergency Chat</h1>
        <p className="text-muted-foreground">Get immediate assistance from your doctor</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Your Doctor</CardTitle>
            <CardDescription>{isOnline ? "Currently online" : "Currently offline"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Avatar className="mr-2 h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Dr. Jane Smith" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Dr. Jane Smith</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className={`mr-1 h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-300"}`}></div>
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium">Your Health Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Type:</span>
                  <span>O+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allergies:</span>
                  <span>Penicillin</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conditions:</span>
                  <span>Hypertension</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Visit:</span>
                  <span>May 10, 2023</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium">Current Medications</h3>
              <div className="space-y-2">
                <div className="rounded-md bg-primary/10 p-2 text-sm">
                  <p className="font-medium">Lisinopril 10mg</p>
                  <p className="text-xs text-muted-foreground">Once daily</p>
                </div>
                <div className="rounded-md bg-primary/10 p-2 text-sm">
                  <p className="font-medium">Metformin 500mg</p>
                  <p className="text-xs text-muted-foreground">Twice daily</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="mb-2 font-medium">Recent Vitals</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Pressure:</span>
                  <span>130/85</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Heart Rate:</span>
                  <span>72 bpm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Sugar:</span>
                  <span>110 mg/dL</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col md:col-span-2">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emergency Chat</CardTitle>
                <CardDescription>
                  {isOnline
                    ? "Your doctor is online and will respond shortly"
                    : "Your doctor is offline. AI assistant is available"}
                </CardDescription>
              </div>
              {!isOnline && (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                >
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  AI Mode
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-[calc(100vh-350px)] overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}>
                    {message.sender !== "patient" && (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={message.senderName} />
                        <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === "patient"
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
                    {message.sender === "patient" && (
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
                <Button variant="ghost" size="icon">
                  <FileText className="h-4 w-4" />
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
