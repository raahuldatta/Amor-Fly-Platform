"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, Globe, Heart, Search, Filter, Plus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"

interface Pod {
  _id: string
  skill: string
  skillLevel: string
  maxMembers: number
  members: Array<{
    userId: string
    anonymousName: string
    joinedAt: string
  }>
  status: string
  totalGrowthPoints: number
}

export default function PodsPage() {
  const [pods, setPods] = useState<Pod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [skillLevel, setSkillLevel] = useState("all")
  const { isLoaded, isSignedIn } = useUser()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        fetchPods()
      }
      setMounted(true)
    }
  }, [isLoaded, isSignedIn])

  const fetchPods = async () => {
    try {
      const response = await fetch("/api/pods")
      const data = await response.json()
      if (data.pods) {
        setPods(data.pods)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pods",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinPod = async (podId: string) => {
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "Please log in to join a pod",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/pods", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ podId }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "You've joined the pod!",
        })
        fetchPods() // Refresh pod list
      } else {
        const data = await response.json()
        throw new Error(data.error || "Failed to join pod")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join pod",
        variant: "destructive",
      })
    }
  }

  const filteredPods = pods.filter(pod => {
    const matchesSearch = pod.skill.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = skillLevel === "all" || pod.skillLevel === skillLevel
    return matchesSearch && matchesLevel
  })

  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Animated3DBackground />
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg gradient-text animate-fade-in">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Animated3DBackground />
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg gradient-text animate-fade-in-up">Please log in to view pods</p>
          <Link href="/sign-in">
            <Button className="mt-4 glass-button animate-fade-in-delay">Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Animated3DBackground />
        <div className="text-center z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg gradient-text animate-fade-in">Loading pods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6 animate-bounce-in">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 animate-fade-in-up">
            Discover Pods
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto animate-fade-in-delay">
            Join skill-based pods to learn, grow, and connect with like-hearted learners.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="glass-card p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                placeholder="Search pods by skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 transition-all duration-300"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 z-10" />
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className="w-[200px] pl-10 bg-white/10 border-white/20 text-white focus:bg-white/20 transition-all duration-300">
                  <SelectValue placeholder="Skill Level" />
                </SelectTrigger>
                <SelectContent className="bg-white/20 backdrop-blur-xl border-white/20">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Link href="/pods/create">
              <Button className="glass-button px-6 py-2 hover:scale-105 transition-transform duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Create Pod
              </Button>
            </Link>
          </div>
        </div>

        {/* Pods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPods.map((pod, index) => (
            <div 
              key={pod._id} 
              className="glass-card p-8 flex flex-col gap-4 items-center text-center hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg">
                  {pod.skillLevel}
                </Badge>
                <span className="text-sm text-white/60 px-2 py-1 bg-white/10 rounded-full">
                  {pod.status}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold gradient-text mb-2">{pod.skill}</h3>
              
              <div className="flex items-center gap-2 text-white/80 mb-4">
                <Users className="h-5 w-5" />
                <span className="text-base font-medium">
                  {pod.members.length}/{pod.maxMembers} members
                </span>
              </div>
              
              <div className="flex -space-x-2 justify-center mb-4">
                {pod.members.slice(0, 5).map((member) => (
                  <Avatar
                    key={member.userId}
                    className="h-10 w-10 border-2 border-white/20 hover:scale-110 transition-transform duration-200"
                  >
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white font-semibold">
                      {member.anonymousName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {pod.members.length > 5 && (
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center text-white text-sm font-medium border-2 border-white/20">
                    +{pod.members.length - 5}
                  </div>
                )}
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(pod.members.length / pod.maxMembers) * 100}%` }}
                />
              </div>
              
              <p className="text-sm text-white/60 mb-4">
                Total Growth Points: <span className="text-pink-400 font-semibold">{pod.totalGrowthPoints}</span>
              </p>
              
              <Button
                onClick={() => handleJoinPod(pod._id)}
                className="glass-button w-full hover:bg-white/30 transition-all duration-300"
                disabled={pod.members.length >= pod.maxMembers}
              >
                {pod.members.length >= pod.maxMembers
                  ? "Pod Full"
                  : "Join Pod"}
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPods.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-semibold gradient-text mb-4">
              No pods found
            </h3>
            <p className="text-white/60 text-lg mb-6">
              Try adjusting your search or filters
            </p>
            <Link href="/pods/create">
              <Button className="glass-button px-8 py-3 text-lg">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Pod
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-white/80 text-lg font-medium drop-shadow">
        Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
} 