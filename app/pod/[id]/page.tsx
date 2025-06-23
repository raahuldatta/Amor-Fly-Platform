"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, ArrowLeft, Users, Target, TrendingUp, Share, ThumbsUp, MessageCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  type: "text" | "progress" | "resource"
  timestamp: Date
  likes: number
  resourceUrl?: string
  progressData?: {
    skill: string
    description: string
    imageUrl?: string
  }
}

interface PodMember {
  id: string
  anonymousName: string
  engagementScore: number
  skillLevel: number
  isOnline: boolean
}

interface Pod {
  id: string
  name: string
  skill: string
  members: PodMember[]
  totalMessages: number
  weeklyGoal: string
}

export default function PodChatPage() {
  const params = useParams()
  const podId = params.id as string

  const [pod, setPod] = useState<Pod | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [progressUpdate, setProgressUpdate] = useState("")
  const [resourceUrl, setResourceUrl] = useState("")
  const [resourceDescription, setResourceDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add polling function
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/pods/${podId}/messages`)
        if (response.ok) {
          const newMessages = await response.json()
          setMessages(newMessages)
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(interval)
  }

  // Update useEffect to use polling instead of socket
  useEffect(() => {
    fetchPodData()
    fetchMessages()
    const cleanup = startPolling()
    return cleanup
  }, [podId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchPodData = async () => {
    try {
      const response = await fetch(`/api/pods/${podId}`)
      if (response.ok) {
        const podData = await response.json()
        setPod(podData)
      }
    } catch (error) {
      console.error("Failed to fetch pod data:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/pods/${podId}/messages`)
      if (response.ok) {
        const messagesData = await response.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      const response = await fetch(`/api/pods/${podId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          type: "text",
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])
        setNewMessage("")
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const shareProgress = async () => {
    if (!progressUpdate.trim()) return

    try {
      const response = await fetch(`/api/pods/${podId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: progressUpdate,
          type: "progress",
          progressData: {
            skill: pod?.skill || "",
            description: progressUpdate,
          },
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])
        setProgressUpdate("")
      }
    } catch (error) {
      console.error("Failed to share progress:", error)
    }
  }

  const shareResource = async () => {
    if (!resourceUrl.trim() || !resourceDescription.trim()) return

    try {
      const response = await fetch(`/api/pods/${podId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: resourceDescription,
          type: "resource",
          resourceUrl: resourceUrl,
        }),
      })

      if (response.ok) {
        const message = await response.json()
        setMessages((prev) => [...prev, message])
        setResourceUrl("")
        setResourceDescription("")
      }
    } catch (error) {
      console.error("Failed to share resource:", error)
    }
  }

  const likeMessage = async (messageId: string) => {
    try {
      await fetch(`/api/pods/${podId}/messages/${messageId}/like`, {
        method: "POST",
      })

      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg)))
    } catch (error) {
      console.error("Failed to like message:", error)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg text-gray-600">Loading your Flight Pod...</p>
        </div>
      </div>
    )
  }

  if (!pod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-lg text-gray-600 mb-4">Pod not found</p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">{pod.name}</h1>
                <p className="text-sm text-gray-600">
                  {pod.skill} • {pod.members.length}/6 members
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {pod.members.filter((m) => m.isOnline).length} online
              </Badge>
              <Button variant="ghost" size="sm">
                <Users className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pod Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pod Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pod.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{member.anonymousName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.anonymousName}</p>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${member.isOnline ? "bg-green-500" : "bg-gray-300"}`} />
                          <span className="text-xs text-gray-500">Level {member.skillLevel}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.engagementScore}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weekly Goal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Weekly Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{pod.weeklyGoal}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              <CardHeader className="border-b">
                <Tabs defaultValue="chat" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                    <TabsTrigger value="progress">Share Progress</TabsTrigger>
                    <TabsTrigger value="resources">Share Resource</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsContent value="chat" className="flex-1 flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {message.senderName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{message.senderName}</span>
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>

                        {message.type === "text" && (
                          <div className="ml-8 bg-white rounded-lg p-3 shadow-sm">
                            <p className="text-sm">{message.content}</p>
                          </div>
                        )}

                        {message.type === "progress" && (
                          <div className="ml-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">Progress Update</span>
                            </div>
                            <p className="text-sm">{message.content}</p>
                            {message.progressData?.skill && (
                              <Badge variant="outline" className="mt-2">
                                {message.progressData.skill}
                              </Badge>
                            )}
                          </div>
                        )}

                        {message.type === "resource" && (
                          <div className="ml-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center space-x-2 mb-2">
                              <Share className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-700">Shared Resource</span>
                            </div>
                            <p className="text-sm mb-2">{message.content}</p>
                            {message.resourceUrl && (
                              <a
                                href={message.resourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>View Resource</span>
                              </a>
                            )}
                          </div>
                        )}

                        <div className="ml-8 flex items-center space-x-4">
                          <Button variant="ghost" size="sm" onClick={() => likeMessage(message.id)} className="text-xs">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            {message.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Share your thoughts with the pod..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="progress" className="flex-1 flex flex-col">
                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Share Your Progress</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Let your pod know about your learning journey and achievements
                        </p>
                      </div>

                      <Textarea
                        value={progressUpdate}
                        onChange={(e) => setProgressUpdate(e.target.value)}
                        placeholder="What have you learned or accomplished recently? Share your wins, challenges, or insights..."
                        className="min-h-[120px]"
                      />

                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Sharing progress earns you Growth Points and helps unlock 1:1 connections
                        </p>
                        <Button onClick={shareProgress} disabled={!progressUpdate.trim()}>
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Share Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="resources" className="flex-1 flex flex-col">
                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Share a Resource</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Share helpful links, videos, articles, or tools with your pod
                        </p>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Resource URL</label>
                        <Input
                          value={resourceUrl}
                          onChange={(e) => setResourceUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=... or any helpful link"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Description</label>
                        <Textarea
                          value={resourceDescription}
                          onChange={(e) => setResourceDescription(e.target.value)}
                          placeholder="Why is this resource helpful? What will pod members learn from it?"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">
                          Sharing valuable resources increases your community contribution score
                        </p>
                        <Button onClick={shareResource} disabled={!resourceUrl.trim() || !resourceDescription.trim()}>
                          <Share className="w-4 h-4 mr-2" />
                          Share Resource
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
