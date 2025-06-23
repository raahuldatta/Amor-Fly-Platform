"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Clock, Globe, MessageSquare, Settings, Heart, Crown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { PodChat } from "@/app/components/pods/PodChat"

export default function PodPage() {
  return (
    <div className="relative min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="glass-card p-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Pod Details</h1>
          <p className="text-muted-foreground">Pod details page coming soon...</p>
        </div>
      </div>
    </div>
  )
}