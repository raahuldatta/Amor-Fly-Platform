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
    
    // Get pod from Supabase
    const { data: pod, error: podError } = await supabase
      .from('pods')
      .select('*')
      .eq('id', podId)
      .single()

    if (podError || !pod) {
      return NextResponse.json({ error: "Pod not found" }, { status: 404 })
    }

    return NextResponse.json({ pod })
  } catch (error) {
    console.error("Error in GET /api/pods/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
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

    // Get pod to check permissions
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
        ...body,
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
    console.error("Error in PUT /api/pods/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
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

    // Get pod to check permissions
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
    console.error("Error in DELETE /api/pods/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
