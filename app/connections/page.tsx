"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Heart, MessageCircle, Clock, CheckCircle, X, ArrowLeft, Users, Target, UserPlus, History } from "lucide-react"
import Link from "next/link"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"

interface PotentialConnection {
  id: string
  anonymousName: string
  sharedSkills: string[]
  compatibilityScore: number
  engagementLevel: number
  growthPoints: number
  personalityMatch: string[]
}

interface ActiveConnection {
  id: string
  userId: string
  anonymousName: string
  connectedAt: Date
  status: "active" | "expired"
  chatId: string
  sharedSkills: string[]
  weekNumber: number
}

interface ConnectionRequest {
  id: string
  fromUserId: string
  fromUserName: string
  toUserId: string
  status: "pending" | "accepted" | "declined"
  createdAt: Date
  sharedSkills: string[]
  message: string
}

export default function ConnectionsPage() {
  const [potentialConnections, setPotentialConnections] = useState<PotentialConnection[]>([])
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([])
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([])
  const [weeklyConnectionsUsed, setWeeklyConnectionsUsed] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchConnectionData()
  }, [])

  const fetchConnectionData = async () => {
    try {
      const [potentialRes, activeRes, requestsRes] = await Promise.all([
        fetch("/api/connections/potential"),
        fetch("/api/connections/active"),
        fetch("/api/connections/requests"),
      ])

      if (potentialRes.ok) {
        const data = await potentialRes.json()
        setPotentialConnections(data.connections)
        setWeeklyConnectionsUsed(data.weeklyConnectionsUsed)
      }

      if (activeRes.ok) {
        const data = await activeRes.json()
        setActiveConnections(data)
      }

      if (requestsRes.ok) {
        const data = await requestsRes.json()
        setConnectionRequests(data)
      }
    } catch (error) {
      console.error("Failed to fetch connection data:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendConnectionRequest = async (targetUserId: string) => {
    try {
      const response = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId,
          message: "I'd love to connect and learn together!",
        }),
      })

      if (response.ok) {
        await fetchConnectionData()
      }
    } catch (error) {
      console.error("Failed to send connection request:", error)
    }
  }

  const respondToRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      const response = await fetch(`/api/connections/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        await fetchConnectionData()
      }
    } catch (error) {
      console.error("Failed to respond to request:", error)
    }
  }

  const canMakeNewConnection = weeklyConnectionsUsed < 1

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Animated3DBackground />
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg gradient-text animate-fade-in">Loading connections...</p>
        </div>
      </div>
    )
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
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="glass-button hover:bg-white/30">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">1:1 Connections</h1>
                  <p className="text-white/80">Build deeper relationships with compatible learners</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg">
                  {weeklyConnectionsUsed}/1 Weekly Connections
                </Badge>
                {!canMakeNewConnection && (
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Resets in 3 days
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="discover" className="space-y-8">
            <TabsList className="glass-card grid w-full grid-cols-4 p-1">
              <TabsTrigger value="discover" className="glass-button data-[state=active]:bg-white/30">
                <UserPlus className="w-4 h-4 mr-2" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="requests" className="glass-button data-[state=active]:bg-white/30">
                <MessageCircle className="w-4 h-4 mr-2" />
                Requests
                {connectionRequests.filter((r) => r.status === "pending").length > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                    {connectionRequests.filter((r) => r.status === "pending").length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" className="glass-button data-[state=active]:bg-white/30">
                <Users className="w-4 h-4 mr-2" />
                Active
              </TabsTrigger>
              <TabsTrigger value="history" className="glass-button data-[state=active]:bg-white/30">
                <History className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8 animate-fade-in">
              {!canMakeNewConnection ? (
                <div className="glass-card p-12 text-center">
                  <Clock className="w-20 h-20 text-white/60 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold gradient-text mb-4">Weekly Limit Reached</h3>
                  <p className="text-white/80 text-lg mb-6">
                    You've used your weekly connection. New connections unlock in 3 days.
                  </p>
                  <p className="text-white/60">
                    Use this time to deepen your current connections and engage more in your Flight Pod.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="glass-card p-8">
                    <h2 className="text-2xl font-bold gradient-text mb-2">Compatible Learners</h2>
                    <p className="text-white/80">
                      These learners share your goals and have compatible learning styles. You can make 1 connection
                      this week.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {potentialConnections.map((connection, index) => (
                      <div 
                        key={connection.id} 
                        className="glass-card p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="text-center mb-6">
                          <Avatar className="w-20 h-20 mx-auto mb-4 border-4 border-white/20">
                            <AvatarFallback className="text-xl bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
                              {connection.anonymousName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <h3 className="text-xl font-bold gradient-text mb-2">{connection.anonymousName}</h3>
                          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                            {connection.compatibilityScore}% Match
                          </Badge>
                        </div>
                        
                        <div className="space-y-6">
                          <div>
                            <p className="text-white/80 font-medium mb-3">Shared Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {connection.sharedSkills.map((skill) => (
                                <Badge key={skill} className="bg-white/20 text-white border-white/20">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-white/80 font-medium mb-3">Personality Match</p>
                            <div className="flex flex-wrap gap-2">
                              {connection.personalityMatch.map((trait) => (
                                <Badge key={trait} className="bg-white/10 text-white/80 border-white/20">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-white/80">
                              <span>Engagement Level</span>
                              <span className="font-semibold">{connection.engagementLevel}%</span>
                            </div>
                            <Progress value={connection.engagementLevel} className="h-2 bg-white/10">
                              <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" 
                                   style={{ width: `${connection.engagementLevel}%` }} />
                            </Progress>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-white/80">Growth Points</span>
                            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                              {connection.growthPoints}
                            </Badge>
                          </div>

                          <Button
                            onClick={() => sendConnectionRequest(connection.id)}
                            className="w-full glass-button hover:bg-white/30 transition-all duration-300"
                            disabled={!canMakeNewConnection}
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Send Connection Request
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {potentialConnections.length === 0 && (
                    <div className="glass-card p-12 text-center">
                      <Users className="w-20 h-20 text-white/60 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold gradient-text mb-4">No Compatible Learners</h3>
                      <p className="text-white/80 text-lg mb-6">
                        We're still finding learners who match your skills and personality.
                      </p>
                      <p className="text-white/60">
                        Keep engaging in your Flight Pod to improve your matching score!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold gradient-text mb-2">Connection Requests</h2>
                <p className="text-white/80">Manage incoming and outgoing connection requests</p>
              </div>

              <div className="space-y-6">
                {connectionRequests
                  .filter((request) => request.status === "pending")
                  .map((request, index) => (
                    <div 
                      key={request.id} 
                      className="glass-card p-6 hover:scale-102 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="border-2 border-white/20">
                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
                              {request.fromUserName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-bold text-white text-lg">{request.fromUserName}</h4>
                            <p className="text-white/80 mb-3">{request.message}</p>
                            <div className="flex flex-wrap gap-2">
                              {request.sharedSkills.map((skill) => (
                                <Badge key={skill} className="bg-white/20 text-white border-white/20">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            size="sm"
                            onClick={() => respondToRequest(request.id, "accept")}
                            disabled={!canMakeNewConnection}
                            className="glass-button bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => respondToRequest(request.id, "decline")}
                            className="glass-button bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                {connectionRequests.filter((request) => request.status === "pending").length === 0 && (
                  <div className="glass-card p-12 text-center">
                    <MessageCircle className="w-20 h-20 text-white/60 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold gradient-text mb-4">No Pending Requests</h3>
                    <p className="text-white/80 text-lg">You don't have any connection requests at the moment.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold gradient-text mb-2">Active Connections</h2>
                <p className="text-white/80">Your current 1:1 learning partnerships</p>
              </div>

              <div className="space-y-6">
                {activeConnections.map((connection, index) => (
                  <div 
                    key={connection.id} 
                    className="glass-card p-6 hover:scale-102 transition-all duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="border-2 border-white/20">
                          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-bold">
                            {connection.anonymousName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-white text-lg">{connection.anonymousName}</h4>
                          <p className="text-white/80 mb-3">
                            Connected {new Date(connection.connectedAt).toLocaleDateString()}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {connection.sharedSkills.map((skill) => (
                              <Badge key={skill} className="bg-white/20 text-white border-white/20">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={connection.status === "active" 
                          ? "bg-green-500/20 text-green-300 border-green-500/30" 
                          : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }>
                          {connection.status === "active" ? "Active" : "Expired"}
                        </Badge>
                        <Link href={`/chat/${connection.chatId}`}>
                          <Button size="sm" className="glass-button hover:bg-white/30">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {activeConnections.length === 0 && (
                  <div className="glass-card p-12 text-center">
                    <Heart className="w-20 h-20 text-white/60 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold gradient-text mb-4">No Active Connections</h3>
                    <p className="text-white/80 text-lg">You don't have any active 1:1 connections yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-8 animate-fade-in">
              <div className="glass-card p-12 text-center">
                <Target className="w-20 h-20 text-white/60 mx-auto mb-6" />
                <h3 className="text-2xl font-bold gradient-text mb-4">Connection History</h3>
                <p className="text-white/80 text-lg mb-6">Your past learning partnerships and their outcomes</p>
                <p className="text-white/60">Your connection history will appear here as you build relationships.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
