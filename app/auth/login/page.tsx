"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUser } from "@/lib/auth-service"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDoctorLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const licenseId = formData.get("licenseId") as string

    try {
      await loginUser({
        email,
        password,
        licenseId,
        role: "doctor",
      })
      router.push("/doctor/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePatientLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await loginUser({
        email,
        password,
        role: "patient",
      })
      router.push("/patient/dashboard")
    } catch (err) {
      setError("Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4"
          >
            <path d="m12 19-7-7 7-7"></path>
            <path d="M19 12H5"></path>
          </svg>
          Back
        </Button>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Login to MediConnect</h1>
          <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
        </div>
        <Tabs defaultValue="doctor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="doctor">Doctor</TabsTrigger>
            <TabsTrigger value="patient">Patient</TabsTrigger>
          </TabsList>
          <TabsContent value="doctor">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Login</CardTitle>
                <CardDescription>Enter your email, password, and license ID to login</CardDescription>
              </CardHeader>
              <form onSubmit={handleDoctorLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email</Label>
                    <Input id="doctor-email" name="email" type="email" placeholder="doctor@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input id="doctor-password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor-license">License/Clinic ID</Label>
                    <Input id="doctor-license" name="licenseId" placeholder="Enter your license ID" required />
                  </div>
                  {error && <div className="text-sm text-red-500">{error}</div>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="patient">
            <Card>
              <CardHeader>
                <CardTitle>Patient Login</CardTitle>
                <CardDescription>Enter your email and password to login</CardDescription>
              </CardHeader>
              <form onSubmit={handlePatientLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-email">Email</Label>
                    <Input id="patient-email" name="email" type="email" placeholder="patient@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-password">Password</Label>
                    <Input id="patient-password" name="password" type="password" required />
                  </div>
                  {error && <div className="text-sm text-red-500">{error}</div>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
