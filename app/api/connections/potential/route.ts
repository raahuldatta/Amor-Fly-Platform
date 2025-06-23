import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    
    // Get current user from Supabase
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (currentUserError || !currentUser) {
      return NextResponse.json({ error: "Current user not found" }, { status: 404 })
    }

    // Get potential connections (users with similar skills)
    // For now, return all users except the current user
    // TODO: Implement skill-based matching logic
    const { data: potentialUsers, error: usersError } = await supabase
      .from('users')
      .select('*')
      .neq('id', currentUser.id)
      .limit(10)
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching potential users:', usersError)
      return NextResponse.json({ error: "Failed to fetch potential connections" }, { status: 500 })
    }

    // Check which users already have connection requests
    const { data: existingConnections, error: connectionsError } = await supabase
      .from('connections')
      .select('*')
      .or(`requester_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)

    if (connectionsError) {
      console.error('Error fetching existing connections:', connectionsError)
      return NextResponse.json({ error: "Failed to fetch existing connections" }, { status: 500 })
    }

    // Filter out users who already have connection requests
    const connectedUserIds = existingConnections?.map(conn => 
      conn.requester_id === currentUser.id ? conn.recipient_id : conn.requester_id
    ) || []

    const availableUsers = potentialUsers?.filter(user => 
      !connectedUserIds.includes(user.id)
    ) || []

    // Format response
    const formattedUsers = availableUsers.map(user => ({
      id: user.id,
      anonymous_name: user.anonymous_name,
      email: user.email,
      growth_points: user.growth_points,
      engagement_level: user.engagement_level,
      selected_skills: user.selected_skills || [],
      created_at: user.created_at
    }))

    return NextResponse.json({ 
      potentialConnections: formattedUsers,
      totalCount: formattedUsers.length
    })
  } catch (error) {
    console.error("Error in GET /api/connections/potential:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
