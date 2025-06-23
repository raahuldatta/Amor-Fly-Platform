import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase'

import { auth } from "@clerk/nextjs/server"

interface RouteContext {
  params: {
    id: string
  }
}

// Define the shape of your custom metadata
interface CustomJwtSessionClaims {
  metadata: {
    role?: 'admin' | 'user';
  };
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { sessionClaims } = await auth()

    // Cast sessionClaims to your custom type
    const customClaims = sessionClaims as CustomJwtSessionClaims | null

    // Check if user is an admin
    if (customClaims?.metadata.role !== "admin") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      )
    }

    const { id } = context.params
    const body = await request.json()

    const supabase = createServerSupabaseClient()
    
    // TODO: Implement with Supabase
    // const { data, error } = await supabase
    //   .from('reports')
    //   .update({ ...body, updated_at: new Date().toISOString() })
    //   .eq('id', id)
    //   .select()

    // Placeholder response
    return NextResponse.json(
      { message: "Report updated successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating report:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
