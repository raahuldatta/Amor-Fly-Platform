import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

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

    // TODO: Implement pod analytics with Supabase
    // For now, return placeholder data
    const analytics = {
      totalMembers: 0,
      activeMembers: 0,
      totalMessages: 0,
      averageEngagement: 0,
      topContributors: [],
      recentActivity: []
    }

    return NextResponse.json({ analytics })
  } catch (error) {
    console.error("Error in GET /api/pods/analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 