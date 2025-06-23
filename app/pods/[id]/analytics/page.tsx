"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, MessageSquare, TrendingUp, Activity } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface MessageStats {
  date: string
  messageCount: number
  uniqueUsers: number
}

interface MemberEngagement {
  userId: string
  anonymousName: string
  messageCount: number
  lastActive: string
}

interface GrowthPoints {
  date: string
  points: number
}

interface AnalyticsData {
  podId: string
  timeRange: string
  messageStats: MessageStats[]
  memberEngagement: MemberEngagement[]
  growthPoints: GrowthPoints[]
  totalMembers: number
  totalGrowthPoints: number
}

export default function PodAnalyticsPage() {
  const params = useParams()
  const [timeRange, setTimeRange] = useState("week")
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(
          `/api/pods/analytics?podId=${params.id}&timeRange=${timeRange}`
        )
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const data = await response.json()
        setAnalytics(data)
      } catch (error) {
        console.error("Error fetching analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [params.id, timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-violet-900/20 rounded w-1/4" />
            <div className="h-64 bg-violet-900/20 rounded" />
            <div className="h-32 bg-violet-900/20 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-violet-400 mb-4">
              Failed to load analytics
            </h1>
            <Button
              variant="outline"
              className="text-violet-400 border-violet-400 hover:bg-violet-400/10"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/pods/${params.id}`}>
              <Button
                variant="ghost"
                className="text-violet-400 hover:bg-violet-400/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pod
              </Button>
            </Link>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
              Pod Analytics
            </h1>
          </div>
          <Tabs
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3 bg-black border border-violet-400/20">
              <TabsTrigger
                value="day"
                className="data-[state=active]:bg-violet-400/20 data-[state=active]:text-violet-400"
              >
                Day
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="data-[state=active]:bg-violet-400/20 data-[state=active]:text-violet-400"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-violet-400/20 data-[state=active]:text-violet-400"
              >
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-violet-400/10">
                <Users className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-violet-300">Total Members</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalMembers}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-violet-400/10">
                <MessageSquare className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-violet-300">Total Messages</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.messageStats.reduce(
                    (sum, stat) => sum + stat.messageCount,
                    0
                  )}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-violet-400/10">
                <TrendingUp className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-violet-300">Growth Points</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.totalGrowthPoints}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-violet-400/10">
                <Activity className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-violet-300">Active Members</p>
                <p className="text-2xl font-bold text-white">
                  {analytics.memberEngagement.filter(
                    (m) => m.messageCount > 0
                  ).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Message Activity */}
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <h2 className="text-xl font-semibold text-violet-400 mb-4">
              Message Activity
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.messageStats}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(139, 92, 246, 0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(139, 92, 246, 0.5)"
                    tick={{ fill: "rgba(139, 92, 246, 0.5)" }}
                  />
                  <YAxis
                    stroke="rgba(139, 92, 246, 0.5)"
                    tick={{ fill: "rgba(139, 92, 246, 0.5)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="messageCount"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="uniqueUsers"
                    stroke="#C4B5FD"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Growth Points */}
          <Card className="p-6 bg-black/40 border border-violet-400/20">
            <h2 className="text-xl font-semibold text-violet-400 mb-4">
              Growth Points
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.growthPoints}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(139, 92, 246, 0.1)"
                  />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(139, 92, 246, 0.5)"
                    tick={{ fill: "rgba(139, 92, 246, 0.5)" }}
                  />
                  <YAxis
                    stroke="rgba(139, 92, 246, 0.5)"
                    tick={{ fill: "rgba(139, 92, 246, 0.5)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="points" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Member Engagement */}
        <Card className="p-6 bg-black/40 border border-violet-400/20">
          <h2 className="text-xl font-semibold text-violet-400 mb-4">
            Member Engagement
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-violet-400/20">
                  <th className="text-left py-3 px-4 text-violet-300">Member</th>
                  <th className="text-left py-3 px-4 text-violet-300">
                    Messages
                  </th>
                  <th className="text-left py-3 px-4 text-violet-300">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.memberEngagement.map((member) => (
                  <tr
                    key={member.userId}
                    className="border-b border-violet-400/10 hover:bg-violet-400/5"
                  >
                    <td className="py-3 px-4 text-white">
                      {member.anonymousName}
                    </td>
                    <td className="py-3 px-4 text-white">
                      {member.messageCount}
                    </td>
                    <td className="py-3 px-4 text-violet-300">
                      {new Date(member.lastActive).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
} 