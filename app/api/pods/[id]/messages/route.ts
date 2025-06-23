import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

interface RouteContext {
  params: {
    id: string
  }
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: podId } = context.params

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

    // TODO: Implement message fetching with Supabase
    // For now, return placeholder response
    return NextResponse.json({ 
      messages: [],
      totalCount: 0
    })
  } catch (error) {
    console.error("Error in GET /api/pods/[id]/messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: podId } = context.params
    const body = await request.json()
    const { content, type = 'text' } = body

    if (!content) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
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

    // TODO: Implement message creation with Supabase
    // For now, return placeholder response
    return NextResponse.json({ 
      message: "Message creation not yet implemented",
      messageId: null
    }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/pods/[id]/messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
