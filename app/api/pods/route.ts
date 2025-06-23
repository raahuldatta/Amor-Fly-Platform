import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { auth } from "@clerk/nextjs/server"

import { z } from "zod"

// Schema for pod creation
const podSchema = z.object({
  name: z.string().min(3),
  skill: z.string(),
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]),
  maxMembers: z.number().min(2).max(10).default(6),
  description: z.string().optional(),
})

// Schema for pod member
const memberSchema = z.object({
  userId: z.string(),
  anonymousName: z.string(),
  joinedAt: z.date(),
  isActive: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, skill, maxMembers = 6, isPrivate = false } = body

    if (!name || !skill) {
      return NextResponse.json({ error: "Name and skill are required" }, { status: 400 })
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

    // Create new pod
    const { data: pod, error: podError } = await supabase
      .from('pods')
      .insert({
        name,
        description,
        skill,
        max_members: maxMembers,
        is_private: isPrivate,
        creator_id: user.id,
        members: [user.id],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (podError) {
      console.error('Error creating pod:', podError)
      return NextResponse.json({ error: "Failed to create pod" }, { status: 500 })
    }

    return NextResponse.json({ pod }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/pods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Get all pods (for now, return all pods - you can add filtering later)
    const { data: pods, error: podsError } = await supabase
      .from('pods')
      .select('*')
      .order('created_at', { ascending: false })

    if (podsError) {
      console.error('Error fetching pods:', podsError)
      return NextResponse.json({ error: "Failed to fetch pods" }, { status: 500 })
    }

    return NextResponse.json({ pods: pods || [] })
  } catch (error) {
    console.error("Error in GET /api/pods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { podId, updates } = body

    if (!podId) {
      return NextResponse.json({ error: "Pod ID is required" }, { status: 400 })
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

    // Get pod to check if user is creator
    const { data: pod, error: podError } = await supabase
      .from('pods')
      .select('*')
      .eq('id', podId)
      .single()

    if (podError || !pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 })
    }

    if (pod.creator_id !== user.id) {
      return NextResponse.json({ error: "Only pod creator can update pod" }, { status: 403 })
    }

    // Update pod
    const { data: updatedPod, error: updateError } = await supabase
      .from('pods')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', podId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating pod:', updateError)
      return NextResponse.json({ error: "Failed to update pod" }, { status: 500 })
    }

    return NextResponse.json({ pod: updatedPod })
  } catch (error) {
    console.error("Error in PUT /api/pods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const podId = searchParams.get('podId')

    if (!podId) {
      return NextResponse.json({ error: "Pod ID is required" }, { status: 400 })
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

    // Get pod to check if user is creator
    const { data: pod, error: podError } = await supabase
      .from('pods')
      .select('*')
      .eq('id', podId)
      .single()

    if (podError || !pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 })
    }

    if (pod.creator_id !== user.id) {
      return NextResponse.json({ error: "Only pod creator can delete pod" }, { status: 403 })
    }

    // Delete pod
    const { error: deleteError } = await supabase
      .from('pods')
      .delete()
      .eq('id', podId)

    if (deleteError) {
      console.error('Error deleting pod:', deleteError)
      return NextResponse.json({ error: "Failed to delete pod" }, { status: 500 })
    }

    return NextResponse.json({ message: "Pod deleted successfully" })
  } catch (error) {
    console.error("Error in DELETE /api/pods:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 