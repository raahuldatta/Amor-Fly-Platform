import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()
    
    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (error || !user) {
      console.log('User not found in Supabase:', error)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Calculate stats
    const stats = {
      totalGrowthPoints: user.growth_points || 0,
      engagementLevel: user.engagement_level || 0,
      weeklyConnectionsUsed: user.weekly_connections_used || 0,
      weeklyConnectionsLimit: 1, // Example limit
      podParticipationScore: 0, // Placeholder
      currentPod: null, // Placeholder
    }

    return NextResponse.json({ user, stats })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculatePodParticipation(user: any): number {
  // Simple calculation based on user activity
  const baseScore = user.growthPoints || 0
  const engagementBonus = (user.engagementLevel || 0) * 0.5
  return Math.min(100, baseScore + engagementBonus)
}
