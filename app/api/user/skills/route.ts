import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const supabase = createServerSupabaseClient()
    
    // First get the user to get their UUID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Then get their skills
    const { data: skills, error: skillsError } = await supabase
      .from('user_skills')
      .select('skill_name, skill_level, created_at')
      .eq('user_id', user.id)

    if (skillsError) {
      console.error("Error fetching skills:", skillsError)
      return NextResponse.json(
        { error: "Failed to fetch skills" },
        { status: 500 }
      )
    }

    // Transform to match expected format
    const formattedSkills = skills.map(skill => ({
      name: skill.skill_name,
      level: skill.skill_level,
      addedAt: skill.created_at
    }))

    return NextResponse.json({
      skills: formattedSkills,
    })
  } catch (error) {
    console.error("Error fetching user skills:", error)
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { skill, level } = await req.json()
    if (!skill || !level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    
    // First get the user to get their UUID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Insert the skill
    const { error: insertError } = await supabase
      .from('user_skills')
      .insert({
        user_id: user.id,
        skill_name: skill,
        skill_level: level
      })

    if (insertError) {
      console.error("Error adding skill:", insertError)
      return NextResponse.json(
        { error: "Failed to add skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Skill added successfully",
    })
  } catch (error) {
    console.error("Error adding skill:", error)
    return NextResponse.json(
      { error: "Failed to add skill" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const skillName = searchParams.get("skill")
    if (!skillName) {
      return NextResponse.json(
        { error: "Missing skill parameter" },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    
    // First get the user to get their UUID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Delete the skill
    const { error: deleteError } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', user.id)
      .eq('skill_name', skillName)

    if (deleteError) {
      console.error("Error removing skill:", deleteError)
      return NextResponse.json(
        { error: "Failed to remove skill" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Skill removed successfully",
    })
  } catch (error) {
    console.error("Error removing skill:", error)
    return NextResponse.json(
      { error: "Failed to remove skill" },
      { status: 500 }
    )
  }
} 