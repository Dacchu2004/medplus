"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { getCurrentUser, logoutUser } from "@/lib/auth-service"
import { updateUserSettings } from "@/lib/api-service"

export default function DoctorSettings() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState({
    email: "",
    language: "en",
    notifications: {
      appointments: true,
      messages: true,
      emergencies: true,
    },
    availability: {
      monday: { available: true, start: "09:00", end: "17:00" },
      tuesday: { available: true, start: "09:00", end: "17:00" },
      wednesday: { available: true, start: "09:00", end: "17:00" },
      thursday: { available: true, start: "09:00", end: "17:00" },
      friday: { available: true, start: "09:00", end: "17:00" },
      saturday: { available: false, start: "09:00", end: "13:00" },
      sunday: { available: false, start: "09:00", end: "13:00" },
    },
    profile: {
      specialization: "General Medicine",
      bio: "Experienced doctor with over 10 years of practice in general medicine.",
      education: "MD, University Medical School",
    },
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setSettings({
        ...settings,
        email: currentUser.email || "",
      })
    }
    setIsLoading(false)
  }, [])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      if (user) {
        await updateUserSettings(user.id, settings)
        // Show success message or toast
      }
    } catch (error) {
      console.error("Failed to save settings:", error)
      // Show error message or toast
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await logoutUser()
    router.push("/auth/login")
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
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user?.name || ""} disabled />
                <p className="text-xs text-muted-foreground">Contact administration to update your name.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="license-id">License/Clinic ID</Label>
                <Input id="license-id" value={user?.licenseId || ""} disabled />
                <p className="text-xs text-muted-foreground">Contact administration to update your license ID.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter your current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter your new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm your new password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Professional Profile</CardTitle>
              <CardDescription>Update your professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Select
                  value={settings.profile.specialization}
                  onValueChange={(value) =>
                    setSettings({
                      ...settings,
                      profile: {
                        ...settings.profile,
                        specialization: value,
                      },
                    })
                  }
                >
                  <SelectTrigger id="specialization">
                    <SelectValue placeholder="Select a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={settings.profile.education}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: {
                        ...settings.profile,
                        education: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., MD, University Medical School"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      profile: {
                        ...settings.profile,
                        bio: e.target.value,
                      },
                    })
                  }
                  placeholder="Write a brief professional bio"
                  rows={5}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
              <CardDescription>Set your working hours and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(settings.availability).map(([day, value]) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 font-medium capitalize">{day}</div>
                    <Switch
                      checked={value.available}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          availability: {
                            ...settings.availability,
                            [day]: {
                              ...value,
                              available: checked,
                            },
                          },
                        })
                      }
                    />
                    <div className="flex flex-1 items-center gap-2">
                      <Select
                        value={value.start}
                        onValueChange={(newValue) =>
                          setSettings({
                            ...settings,
                            availability: {
                              ...settings.availability,
                              [day]: {
                                ...value,
                                start: newValue,
                              },
                            },
                          })
                        }
                        disabled={!value.available}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                              {`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">to</span>
                      <Select
                        value={value.end}
                        onValueChange={(newValue) =>
                          setSettings({
                            ...settings,
                            availability: {
                              ...settings.availability,
                              [day]: {
                                ...value,
                                end: newValue,
                              },
                            },
                          })
                        }
                        disabled={!value.available}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                              {`${hour}:00 ${hour < 12 ? "AM" : "PM"}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new and updated appointments
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.appointments}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        appointments: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new messages from patients</p>
                </div>
                <Switch
                  checked={settings.notifications.messages}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        messages: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Emergency Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive high-priority notifications for emergency requests
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.emergencies}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        emergencies: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>Language Settings</CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                    <SelectItem value="ja">Japanese</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-sm text-muted-foreground">
                  This will change the language of the interface and notifications.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
