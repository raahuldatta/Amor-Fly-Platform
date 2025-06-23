import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { auth } from "@clerk/nextjs/server"

interface CustomJwtSessionClaims {
  metadata: {
    role?: "admin" | "user"
  }
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement with Supabase
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
  } catch (error) {
    console.error("Admin pods fetch error:", error)
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });
  }
}
