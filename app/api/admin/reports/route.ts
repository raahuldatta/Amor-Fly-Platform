import { NextResponse } from "next/server"
import { createServerSupabaseClient } from '@/lib/supabase'
import { auth } from "@clerk/nextjs/server"

// Define the shape of your custom metadata
interface CustomJwtSessionClaims {
  metadata: {
    role?: "admin" | "user"
  }
}

export async function GET() {
  try {
    const { sessionClaims } = await auth()

    const customClaims = sessionClaims as CustomJwtSessionClaims | null

    if (customClaims?.metadata.role !== "admin") {
// TODO: Implement with Supabase
return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });

    }

    const supabase = createServerSupabaseClient()

    // TODO: Implement with Supabase
    // const { data, error } = await supabase
    //   .from('reports')
    //   .select('*')
    //   .order('created_at', { ascending: false })

    // Placeholder response
    return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });

  } catch (error) {
    console.error("Admin reports fetch error:", error)
// TODO: Implement with Supabase
return NextResponse.json({ message: "Not implemented yet" }, { status: 501 });

  }
}
