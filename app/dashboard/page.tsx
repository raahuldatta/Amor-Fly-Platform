"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Target, Heart, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import { redirect } from "next/navigation"
import { UserButton } from "@clerk/nextjs"
import ProfilePreparing from './ProfilePreparing';
import { useEffect, useRef, useState } from 'react';
import { SkillManager } from '../components/skills/SkillManager';
import { useAuth } from '@clerk/nextjs';
import { Animated3DBackground } from "@/components/ui/animated-3d-background"

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    let start = ref.current;
    let end = value;
    let duration = 800;
    let startTime: number | null = null;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.floor(start + (end - start) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
    ref.current = value;
  }, [value]);
  return <span>{display}</span>;
}

// Badge definitions
interface Badge {
  key: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  earned: (user: any, stats: any) => boolean;
}

function hasFirstSkill(user: any, stats: any): boolean {
  return user.selected_skills && user.selected_skills.length > 0;
}
function hasGrowth100(user: any, stats: any): boolean {
  return stats.totalGrowthPoints >= 100;
}
function isPodMember(user: any, stats: any): boolean {
  return !!stats.podParticipationScore;
}
function isEngaged(user: any, stats: any): boolean {
  return stats.engagementLevel >= 50;
}
function hasConnections(user: any, stats: any): boolean {
  return stats.weeklyConnectionsUsed > 0;
}

const BADGES: Badge[] = [
  {
    key: 'first_skill',
    label: 'First Skill',
    description: 'Add your first skill',
    icon: <span role="img" aria-label="star">⭐</span>,
    earned: hasFirstSkill,
  },
  {
    key: 'growth_100',
    label: '100 Growth',
    description: 'Earn 100 growth points',
    icon: <span role="img" aria-label="rocket">🚀</span>,
    earned: hasGrowth100,
  },
  {
    key: 'pod_member',
    label: 'Pod Member',
    description: 'Join a pod',
    icon: <span role="img" aria-label="group">👥</span>,
    earned: isPodMember,
  },
  {
    key: 'engaged',
    label: 'Engaged',
    description: 'Reach 50% engagement',
    icon: <span role="img" aria-label="fire">🔥</span>,
    earned: isEngaged,
  },
  {
    key: 'connections',
    label: 'Connector',
    description: 'Use a weekly connection',
    icon: <span role="img" aria-label="link">🔗</span>,
    earned: hasConnections,
  },
];

function FloatingDashboardBlob({ className = "", style = {}, color = "#ec4899", size = 120, top = 0, left = 0, animation = "" }) {
  return (
    <div
      className={`absolute pointer-events-none blur-2xl opacity-60 ${className}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle at 60% 40%, ${color} 0%, transparent 80%)`,
        filter: "blur(32px)",
        zIndex: 1,
        ...style
      }}
    >
      <div className={`w-full h-full rounded-full ${animation}`}></div>
    </div>
  )
}

export default function DashboardPage() {
    const { isSignedIn } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/user/profile');
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUser(data.user);
                setStats(data.stats);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <ProfilePreparing />;
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h1>
                    <p className="text-muted-foreground">{error || 'User not found'}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-background overflow-x-hidden">
            {/* 3D Animated Background */}
            <Animated3DBackground intensity={0.3} />
            {/* Floating 3D Blobs */}
            <FloatingDashboardBlob color="#ec4899" size={160} top={-40} left={-60} animation="animate-bounce-in" />
            <FloatingDashboardBlob color="#a855f7" size={100} top={80} left={700} animation="animate-fade-in-up" />
            <FloatingDashboardBlob color="#f472b6" size={80} top={600} left={100} animation="animate-fade-in-up" />
            {/* Profile Card */}
            <div className="absolute top-8 right-8 z-20 animate-fade-in-up">
                <div className="glass-card flex items-center gap-4 p-4 shadow-xl hover-lift hover-glow">
                    <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl">
                            {user.anonymous_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-bold text-lg gradient-text">{user.anonymous_name || 'Learner'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="flex gap-2 mt-1">
                            <span className="bg-pink-100 text-pink-600 rounded px-2 py-0.5 text-xs">Growth: <AnimatedNumber value={stats.totalGrowthPoints} /></span>
                            <span className="bg-purple-100 text-purple-600 rounded px-2 py-0.5 text-xs">Engagement: <AnimatedNumber value={stats.engagementLevel} />%</span>
                        </div>
                    </div>
                </div>
            </div>
            <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
                {/* Welcome Section */}
                <div className="mb-10 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
                    <Avatar className="w-20 h-20 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-3xl">
                            {user.anonymous_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-1 gradient-text">Welcome, {user.anonymous_name || 'Learner'}!</h2>
                        <p className="text-lg text-muted-foreground mb-2">Your learning journey continues...</p>
                        <div className="bg-pink-100/60 dark:bg-pink-900/30 rounded-lg p-4 border border-pink-200 dark:border-pink-800 glass-card animate-fade-in-up">
                            <p className="text-pink-600 dark:text-pink-200">
                                {user.growth_points > 0 
                                    ? `You've earned ${user.growth_points} growth points so far! Keep going!`
                                    : "Start your journey by adding skills and connecting with others!"}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Achievements & Badges */}
                <div className="mb-10 animate-fade-in-up">
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Achievements & Badges</h3>
                    <div className="flex flex-wrap gap-6">
                        {BADGES.map(badge => {
                            const isEarned = badge.earned(user, stats);
                            return (
                                <div key={badge.key} className={`glass-card p-6 flex flex-col items-center text-center w-40 hover-lift hover-glow ${isEarned ? 'border-2 border-pink-400' : 'opacity-60'}`}>
                                    <div className="text-3xl mb-2">{badge.icon}</div>
                                    <div className="font-bold gradient-text mb-1">{badge.label}</div>
                                    <div className="text-xs text-muted-foreground mb-1">{badge.description}</div>
                                    {isEarned && <span className="text-pink-400 text-xs font-semibold">Earned!</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Skill Progress & Manager */}
                <div className="mb-10 animate-fade-in-up">
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Your Skills</h3>
                    <SkillManager />
                </div>
                {/* Stats Section */}
                <div className="mb-10 animate-fade-in-up">
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Your Stats</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="glass-card p-6 flex flex-col items-center text-center hover-lift hover-glow">
                            <TrendingUp className="w-10 h-10 text-pink-400 mb-2" />
                            <div className="text-2xl font-bold gradient-text"><AnimatedNumber value={stats.totalGrowthPoints} /></div>
                            <div className="text-sm text-muted-foreground">Growth Points</div>
                        </div>
                        <div className="glass-card p-6 flex flex-col items-center text-center hover-lift hover-glow">
                            <Zap className="w-10 h-10 text-purple-400 mb-2" />
                            <div className="text-2xl font-bold gradient-text"><AnimatedNumber value={stats.engagementLevel} />%</div>
                            <div className="text-sm text-muted-foreground">Engagement</div>
                        </div>
                        <div className="glass-card p-6 flex flex-col items-center text-center hover-lift hover-glow">
                            <Users className="w-10 h-10 text-pink-300 mb-2" />
                            <div className="text-2xl font-bold gradient-text"><AnimatedNumber value={stats.weeklyConnectionsUsed} /></div>
                            <div className="text-sm text-muted-foreground">Weekly Connections</div>
                        </div>
                    </div>
                </div>
                {/* Main Content Tabs */}
                <Tabs defaultValue="pod" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 glass-card mb-6">
                        <TabsTrigger value="pod" className="flex items-center space-x-2">My Pod</TabsTrigger>
                        <TabsTrigger value="connections" className="flex items-center space-x-2">Connections</TabsTrigger>
                        <TabsTrigger value="progress" className="flex items-center space-x-2">Progress</TabsTrigger>
                        <TabsTrigger value="discover" className="flex items-center space-x-2">Discover</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pod" className="space-y-6">
                        {stats.currentPod ? (
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <Users className="w-8 h-8 text-pink-400" />
                                    <div>
                                        <h3 className="text-xl font-bold gradient-text mb-1">{stats.currentPod.name}</h3>
                                        <div className="text-muted-foreground">Flight Pod • {stats.currentPod.skill} • {stats.currentPod.members}/6 members</div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    {[...Array(stats.currentPod.members)].map((_, i) => (
                                        <Avatar key={i} className="w-12 h-12">
                                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-lg">{i === 0 ? (user.anonymous_name?.charAt(0) || user.email?.charAt(0).toUpperCase()) : `M${i+1}`}</AvatarFallback>
                                        </Avatar>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <Button className="glass-button flex-1">Go to Pod Chat</Button>
                                    <Button className="glass-button flex-1 bg-white/60 dark:bg-black/30 text-pink-600 dark:text-pink-200 border border-pink-200 dark:border-pink-800">Share Progress</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="glass-card p-8 text-center">
                                <Users className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2 gradient-text">Finding Your Flight Pod</h3>
                                <p className="text-muted-foreground mb-4">We're matching you with learners who share your goals and personality vibe.</p>
                                <Button className="glass-button">Refresh</Button>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="connections" className="space-y-6">
                        <div className="glass-card p-8 text-center">
                            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 gradient-text">1:1 Connections</h3>
                            <p className="text-muted-foreground mb-4">Build deeper relationships with compatible learners</p>
                            <Button className="glass-button">Find Connections</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="progress" className="space-y-6">
                        <div className="glass-card p-8 text-center">
                            <Zap className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 gradient-text">Your Progress</h3>
                            <p className="text-muted-foreground mb-4">Track your learning journey and celebrate your achievements!</p>
                            <Button className="glass-button">View Progress</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="discover" className="space-y-6">
                        <div className="glass-card p-8 text-center">
                            <Target className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2 gradient-text">Discover New Skills</h3>
                            <p className="text-muted-foreground mb-4">Explore trending skills and join new learning communities</p>
                            <Button className="glass-button">Explore</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
            <footer className="w-full py-6 text-center text-muted-foreground text-sm z-10">
                Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
            </footer>
        </div>
    )
}
