import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    anonymousName?: string
    role?: string
    growthPoints?: number
    engagementLevel?: number
    selectedSkills?: string[]
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      anonymousName?: string
      role?: string
      growthPoints?: number
      engagementLevel?: number
      selectedSkills?: string[]
    }
  }
} 