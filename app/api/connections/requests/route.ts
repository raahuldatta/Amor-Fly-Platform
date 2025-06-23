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
    
    // Get user from Supabase
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkId)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get pending connection requests for user
    const { data: requests, error: requestsError } = await supabase
      .from('connections')
      .select(`
        *,
        requester:users!connections_requester_id_fkey(*)
      `)
      .eq('recipient_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (requestsError) {
      console.error('Error fetching connection requests:', requestsError)
      return NextResponse.json({ error: "Failed to fetch connection requests" }, { status: 500 })
    }

    // Format requests
    const formattedRequests = requests?.map(request => ({
      id: request.id,
      requester: {
        id: request.requester.id,
        anonymous_name: request.requester.anonymous_name,
        email: request.requester.email,
        growth_points: request.requester.growth_points,
        engagement_level: request.requester.engagement_level
      },
      message: request.message,
      status: request.status,
      created_at: request.created_at
    })) || []

    return NextResponse.json({ requests: formattedRequests })
  } catch (error) {
    console.error("Error in GET /api/connections/requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
