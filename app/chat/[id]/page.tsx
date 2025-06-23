"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, ArrowLeft, ImageIcon, FileText, ExternalLink, Heart, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
// Remove these lines:
// import io from "socket.io-client"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  content: string
  type: "text" | "image" | "progress"
  timestamp: Date
  imageUrl?: string
  progressData?: {
    skill: string
    description: string
    imageUrl?: string
  }
}

interface ChatPartner {
  id: string
  anonymousName: string
  sharedSkills: string[]
  isOnline: boolean
  lastSeen?: Date
}

export default function OneOnOneChatPage() {
  const params = useParams()
  const chatId = params.id as string

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [partner, setPartner] = useState<ChatPartner | null>(null)
  const [loading, setLoading] = useState(true)
  // Remove these lines:
  // const [socket, setSocket] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchChatData()
    // const cleanup = startPolling()
    // return cleanup
    const cleanup = startPolling()
    return cleanup
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Replace initializeSocket function with:
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/chat/${chatId}/messages`)
        if (response.ok) {
          const newMessages = await response.json()
          setMessages(newMessages)
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error)
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }

  const fetchChatData = async () => {
    try {
      const [chatRes, messagesRes] = await Promise.all([
        fetch(`/api/chat/${chatId}`),
        fetch(`/api/chat/${chatId}/messages`),
      ])

      if (chatRes.ok) {
        const chatData = await chatRes.json()
        setPartner(chatData.partner)
      }

      if (messagesRes.ok) {
        const messagesData = await messagesRes.json()
        setMessages(messagesData)
      }
    } catch (error) {
      console.error("Failed to fetch chat data:", error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedImage) return

    try {
      let imageUrl = ""
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage)
      }

      const messageData = {
        content: newMessage,
        type: selectedImage ? "image" : "text",
        imageUrl,
      }

      const response = await fetch(`/api/chat/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      })

      if (response.ok) {
        const message = await response.json()
        // Remove socket-related code from sendMessage function
        // socket?.emit("send-message", { chatId, message })
        setNewMessage("")
        setSelectedImage(null)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "amor-fly-uploads")

    const response = await fetch("https://api.cloudinary.com/v1_1/your-cloud-name/image/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    return data.secure_url
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  const handleTyping = () => {
    // socket?.emit("typing", { chatId, isTyping: true })
    // setTimeout(() => {
    //   socket?.emit("typing", { chatId, isTyping: false })
    // }, 1000)
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-lg text-gray-600 mb-4">Chat not found</p>
            <Link href="/connections">
              <Button>Return to Connections</Button>
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
              <Link href="/connections">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <Avatar>
                <AvatarFallback>{partner.anonymousName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{partner.anonymousName}</h1>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${partner.isOnline ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm text-gray-600">
                    {partner.isOnline
                      ? "Online"
                      : partner.lastSeen
                        ? `Last seen ${formatTime(partner.lastSeen)}`
                        : "Offline"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {partner.sharedSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connection Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Shared Skills</p>
                  <div className="space-y-1">
                    {partner.sharedSkills.map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs mr-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Connection Status</p>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    Active This Week
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Time Remaining</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">3 days left</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Share Progress
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Resource
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
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

                    <div className="ml-8">
                      {message.type === "text" && (
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                          <p className="text-sm">{message.content}</p>
                        </div>
                      )}

                      {message.type === "image" && (
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-md">
                          {message.content && <p className="text-sm mb-2">{message.content}</p>}
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl || "/placeholder.svg"}
                              alt="Shared image"
                              className="rounded-lg max-w-full h-auto"
                            />
                          )}
                        </div>
                      )}

                      {message.type === "progress" && message.progressData && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200 max-w-md">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-green-700 border-green-700">
                              Progress Update
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{message.progressData.description}</p>
                          {message.progressData.imageUrl && (
                            <img
                              src={message.progressData.imageUrl || "/placeholder.svg"}
                              alt="Progress image"
                              className="rounded-lg max-w-full h-auto"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center space-x-2 ml-8">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {partner.anonymousName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t p-4">
                {selectedImage && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-sm">{selectedImage.name}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)}>
                        ×
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Input
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value)
                      handleTyping()
                    }}
                    placeholder="Share your thoughts..."
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim() && !selectedImage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
