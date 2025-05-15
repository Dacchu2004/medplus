"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Youtube, Share2, AlertTriangle } from "lucide-react"
import { getFirstAidInfo } from "@/lib/api-service"

export default function FirstAid() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [firstAidInfo, setFirstAidInfo] = useState<any>(null)

  const handleSearch = async () => {
    if (!searchTerm.trim()) return

    setIsLoading(true)
    try {
      const data = await getFirstAidInfo(searchTerm)
      setFirstAidInfo(data)
    } catch (error) {
      console.error("Failed to get first aid information:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">First Aid Assistant</h1>
        <p className="mt-2 text-muted-foreground">Get immediate first aid instructions for common emergencies</p>
      </div>

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Search for First Aid Instructions</CardTitle>
          <CardDescription>
            Enter a condition or emergency situation (e.g., "burn", "choking", "seizure")
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for first aid instructions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="mt-8 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : firstAidInfo ? (
        <Card className="mx-auto mt-8 max-w-3xl">
          <CardHeader>
            <CardTitle>{firstAidInfo.title}</CardTitle>
            <CardDescription>Follow these steps carefully in case of emergency</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="instructions">
              <TabsList className="mb-4">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
              </TabsList>
              <TabsContent value="instructions">
                <div className="rounded-lg border bg-red-50 p-4 dark:bg-red-950">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
                    <p className="font-medium text-red-600 dark:text-red-400">
                      Important: Call emergency services for severe cases
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <ol className="ml-6 list-decimal space-y-2">
                    {firstAidInfo.steps.map((step: string, index: number) => (
                      <li key={index} className="text-lg">
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 flex justify-end">
                    <Button variant="outline">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Instructions
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="videos">
                <div className="space-y-4">
                  {firstAidInfo.videoLinks && firstAidInfo.videoLinks.length > 0 ? (
                    firstAidInfo.videoLinks.map((link: string, index: number) => (
                      <div key={index} className="rounded-lg border p-4">
                        <div className="flex items-center">
                          <Youtube className="mr-2 h-5 w-5 text-red-600" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Instructional Video {index + 1}
                          </a>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Click to watch a video demonstration on YouTube
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No videos available for this condition.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="grid gap-4 sm:grid-cols-2">
                  {firstAidInfo.images && firstAidInfo.images.length > 0 ? (
                    firstAidInfo.images.map((image: string, index: number) => (
                      <div key={index} className="overflow-hidden rounded-lg border">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${firstAidInfo.title} illustration ${index + 1}`}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center text-muted-foreground">
                      No images available for this condition.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-12">
        <h2 className="mb-4 text-2xl font-bold">Common Emergencies</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {["Burn", "Choking", "Heart Attack", "Bleeding", "Seizure"].map((condition) => (
            <Button
              key={condition}
              variant="outline"
              className="h-auto p-4 text-lg"
              onClick={() => {
                setSearchTerm(condition)
                getFirstAidInfo(condition).then(setFirstAidInfo)
              }}
            >
              {condition}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-lg border bg-muted p-6">
        <h2 className="mb-2 text-xl font-bold">Disclaimer</h2>
        <p className="text-muted-foreground">
          This first aid information is provided for educational purposes only and is not a substitute for professional
          medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any
          questions you may have regarding a medical condition or emergency.
        </p>
      </div>
    </div>
  )
}
