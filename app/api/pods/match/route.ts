import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

import { z } from "zod"

// Schema for pod matching request
const matchRequestSchema = z.object({
  skill: z.string(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  availability: z.array(z.string()),
  timezone: z.string(),
  preferredPodSize: z.number().min(2).max(6).default(4),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { skill, maxMembers = 6 } = body

    if (!skill) {
      return NextResponse.json({ error: "Skill is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement pod matching logic with Supabase
    // For now, return placeholder response
    return NextResponse.json({ 
      message: "Pod matching not yet implemented",
      matchedPod: null 
    })
  } catch (error) {
    console.error("Error in POST /api/pods/match:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get pod recommendations
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // TODO: Implement pod discovery logic with Supabase
    // For now, return placeholder response
    return NextResponse.json({ 
      availablePods: [],
      totalCount: 0
    })
  } catch (error) {
    console.error("Error in GET /api/pods/match:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 