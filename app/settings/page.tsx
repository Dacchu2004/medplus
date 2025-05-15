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
import { getCurrentUser, logoutUser } from "@/lib/auth-service"
import { updateUserSettings } from "@/lib/api-service"

export default function Settings() {
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
      reminders: true,
    },
    emergencyHelp: {
      enabled: true,
      shareLocation: true,
      shareVitals: true,
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
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Help</TabsTrigger>
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
                <p className="text-xs text-muted-foreground">Contact your healthcare provider to update your name.</p>
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

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Appointment Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive notifications about upcoming appointments</p>
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
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">Receive notifications for new messages</p>
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
                  <p className="font-medium">Medication Reminders</p>
                  <p className="text-sm text-muted-foreground">Receive reminders to take your medications</p>
                </div>
                <Switch
                  checked={settings.notifications.reminders}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        reminders: checked,
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

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Help Settings</CardTitle>
              <CardDescription>Configure your emergency help preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable Emergency Help</p>
                  <p className="text-sm text-muted-foreground">Allow access to emergency help features</p>
                </div>
                <Switch
                  checked={settings.emergencyHelp.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      emergencyHelp: {
                        ...settings.emergencyHelp,
                        enabled: checked,
                      },
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share Location</p>
                  <p className="text-sm text-muted-foreground">Share your location during emergency help requests</p>
                </div>
                <Switch
                  checked={settings.emergencyHelp.shareLocation}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      emergencyHelp: {
                        ...settings.emergencyHelp,
                        shareLocation: checked,
                      },
                    })
                  }
                  disabled={!settings.emergencyHelp.enabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share Vitals</p>
                  <p className="text-sm text-muted-foreground">Share your vital signs during emergency help requests</p>
                </div>
                <Switch
                  checked={settings.emergencyHelp.shareVitals}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      emergencyHelp: {
                        ...settings.emergencyHelp,
                        shareVitals: checked,
                      },
                    })
                  }
                  disabled={!settings.emergencyHelp.enabled}
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
