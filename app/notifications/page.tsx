"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Heart, MessageCircle, Users, Zap, Check, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"
import Link from "next/link"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "pod",
    title: "New Pod Activity",
    message: "Your pod has a new discussion about React hooks",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "connection",
    title: "New Connection Request",
    message: "Sarah wants to connect with you",
    time: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "achievement",
    title: "Achievement Unlocked",
    message: "You've earned the 'Consistent Learner' badge",
    time: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    message: "John sent you a message in your pod chat",
    time: "2 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "pod":
        return <Users className="w-6 h-6 text-pink-400" />
      case "connection":
        return <Heart className="w-6 h-6 text-pink-400" />
      case "achievement":
        return <Zap className="w-6 h-6 text-pink-400" />
      case "message":
        return <MessageCircle className="w-6 h-6 text-pink-400" />
      default:
        return <Bell className="w-6 h-6 text-pink-400" />
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card border-white/20 bg-white/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Notifications</h1>
                  <p className="text-white/80">Stay updated with your learning journey</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="glass-button hover:bg-white/30 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark all as read
                </Button>
                <Link href="/dashboard">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="glass-button hover:bg-white/30 text-white"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="all" className="space-y-8" onValueChange={setActiveTab}>
            <TabsList className="glass-card grid w-full grid-cols-5 p-1">
              <TabsTrigger value="all" className="glass-button data-[state=active]:bg-white/30">
                <Bell className="w-4 h-4 mr-2" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="unread" className="glass-button data-[state=active]:bg-white/30">
                <Badge className="bg-red-500 text-white text-xs mr-2">
                  {notifications.filter(n => !n.read).length}
                </Badge>
                <span>Unread</span>
              </TabsTrigger>
              <TabsTrigger value="pod" className="glass-button data-[state=active]:bg-white/30">
                <Users className="w-4 h-4 mr-2" />
                <span>Pod</span>
              </TabsTrigger>
              <TabsTrigger value="connection" className="glass-button data-[state=active]:bg-white/30">
                <Heart className="w-4 h-4 mr-2" />
                <span>Connections</span>
              </TabsTrigger>
              <TabsTrigger value="achievement" className="glass-button data-[state=active]:bg-white/30">
                <Zap className="w-4 h-4 mr-2" />
                <span>Achievements</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6 animate-fade-in">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification, index) => (
                  <div 
                    key={notification.id}
                    className={`glass-card p-6 hover:scale-102 transition-all duration-300 animate-fade-in-up ${
                      !notification.read ? 'border-l-4 border-l-pink-400 bg-pink-400/10' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-white text-lg">{notification.title}</h3>
                          <span className="text-sm text-white/60">{notification.time}</span>
                        </div>
                        <p className="text-white/80 text-base leading-relaxed">{notification.message}</p>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => markAsRead(notification.id)}
                            className="glass-button bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card p-12 text-center animate-fade-in">
                  <Bell className="w-20 h-20 text-white/60 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold gradient-text mb-4">No Notifications</h3>
                  <p className="text-white/80 text-lg">
                    {activeTab === "all" 
                      ? "You're all caught up!"
                      : `No ${activeTab} notifications at the moment.`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 