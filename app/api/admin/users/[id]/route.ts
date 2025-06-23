import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createServerSupabaseClient } from '@/lib/supabase';
;

interface CustomJwtSessionClaims {
  metadata: {
    role?: "admin" | "user";
  };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } } // This ID is the Clerk User ID
) {
  try {
    const { sessionClaims } = await auth();
    const customClaims = sessionClaims as CustomJwtSessionClaims | null;

    if (customClaims?.metadata.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { action } = await request.json();
    const supabase = createServerSupabaseClient();
    const clerkUserId = params.id;

    // TODO: Implement with Supabase
    // const { data: userInDb, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('clerk_id', clerkUserId)
    //   .single();
    // if (!userInDb) {
    //   return NextResponse.json({ message: "User not found in DB" }, { status: 404 });
    // }
    // const dbUserId = userInDb.id;

    switch (action) {
      case "activate":
        // TODO: Update user as active in Supabase
        break;
      case "deactivate":
        // TODO: Update user as inactive in Supabase
        await (await clerkClient()).users.banUser(clerkUserId);
        break;
      case "delete":
        // Delete from Clerk
        await (await clerkClient()).users.deleteUser(clerkUserId);
        // TODO: Delete from Supabase
        break;
      default:
        return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ message: `User ${action}d successfully (placeholder)` });
  } catch (error) {
    console.error("Admin user action error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
