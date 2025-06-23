"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Target, Heart, Zap, Moon, Sun, Monitor } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function HomePageClient() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme toggle logic
  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent">
      {/* Animated dreamy gradient background and glass overlay only after mount to avoid hydration errors */}
      {mounted && (
        <>
          <div className="fixed inset-0 w-full h-full z-0" style={{background: "linear-gradient(120deg, #f8e1ef 0%, #e0c3fc 100%)"}} />
          <div className="fixed inset-0 w-full h-full z-0 backdrop-blur-2xl bg-white/30 dark:bg-black/30" />
          <div className="hearts-bg z-0">
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
            <div className="heart" />
          </div>
        </>
      )}
      {/* Hero Section */}
      <main className="flex-1 w-full flex flex-col items-center justify-center">
        <section className="max-w-4xl w-full mx-auto text-center space-y-10 pt-24 pb-16 px-4">
          <Badge className="mb-4 bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200 shadow text-lg px-4 py-2">💖 Skill-Based Community Platform</Badge>
          <h1 className="text-6xl md:text-7xl font-extrabold gradient-text mb-6 drop-shadow-lg leading-tight">Find Your Match, Grow Together</h1>
          <p className="text-2xl text-white/90 dark:text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed font-semibold drop-shadow">
            Join <span className="font-bold text-pink-200">anonymous Flight Pods</span> of 6 learners sharing the same goals. Progress through <span className="font-bold text-purple-200">peer feedback</span>, unlock <span className="font-bold text-pink-200">1:1 connections</span>, and build authentic relationships through mutual growth and love for learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <SignUpButton>
                <button className="glass-button text-xl px-8 py-4">Start Your Journey</button>
            </SignUpButton>
            <Link href="/how-it-works"><button className="glass-button text-xl px-8 py-4 bg-white/60 dark:bg-black/30 text-pink-600 dark:text-pink-200 border border-pink-200 dark:border-pink-800">How It Works</button></Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16 gradient-text drop-shadow-lg">Why Amor Fly?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="glass-card p-10 flex flex-col items-center text-center">
                <Heart className="w-12 h-12 text-pink-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2 gradient-text">Anonymous Flight Pods</h3>
                <p className="text-lg text-white/80 dark:text-white/80 font-medium">Join small groups of 6 learners with shared goals. Stay anonymous until you're ready to connect.</p>
              </div>
              <div className="glass-card p-10 flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-purple-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2 gradient-text">Skill-Based Matching</h3>
                <p className="text-lg text-white/80 dark:text-white/80 font-medium">Get matched with learners who share your goals and personality vibe for meaningful connections.</p>
              </div>
              <div className="glass-card p-10 flex flex-col items-center text-center">
                <Zap className="w-12 h-12 text-pink-300 mb-4" />
                <h3 className="text-2xl font-bold mb-2 gradient-text">Progress Tracking</h3>
                <p className="text-lg text-white/80 dark:text-white/80 font-medium">Earn Growth Points through peer feedback and consistency. Track your learning journey.</p>
              </div>
              <div className="glass-card p-10 flex flex-col items-center text-center">
                <Target className="w-12 h-12 text-purple-300 mb-4" />
                <h3 className="text-2xl font-bold mb-2 gradient-text">Authentic Connections</h3>
                <p className="text-lg text-white/80 dark:text-white/80 font-medium">Unlock limited 1:1 connections through engagement. Quality over quantity, always.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-20">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-5xl font-bold text-center mb-16 gradient-text drop-shadow-lg">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-10">
              <div className="glass-card p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-pink-200 dark:bg-pink-900/40 rounded-full flex items-center justify-center mb-4 font-bold text-2xl text-pink-600">1</div>
                <h3 className="text-xl font-bold mb-2 gradient-text">Choose Your Skills</h3>
                <p className="text-white/80 dark:text-white/80 font-medium">Select skills you want to develop and complete a fun personality assessment.</p>
              </div>
              <div className="glass-card p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-200 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-4 font-bold text-2xl text-purple-600">2</div>
                <h3 className="text-xl font-bold mb-2 gradient-text">Join Your Pod</h3>
                <p className="text-white/80 dark:text-white/80 font-medium">Get placed in a Flight Pod with 5 other anonymous learners.</p>
              </div>
              <div className="glass-card p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-pink-200 dark:bg-pink-900/40 rounded-full flex items-center justify-center mb-4 font-bold text-2xl text-pink-600">3</div>
                <h3 className="text-xl font-bold mb-2 gradient-text">Share & Grow</h3>
                <p className="text-white/80 dark:text-white/80 font-medium">Share progress, exchange resources, and support each other's growth.</p>
              </div>
              <div className="glass-card p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-purple-200 dark:bg-purple-900/40 rounded-full flex items-center justify-center mb-4 font-bold text-2xl text-purple-600">4</div>
                <h3 className="text-xl font-bold mb-2 gradient-text">Unlock Connections</h3>
                <p className="text-white/80 dark:text-white/80 font-medium">Earn engagement points to unlock limited 1:1 connections.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16">
          <div className="max-w-2xl mx-auto glass-card p-12 text-center">
            <h2 className="text-4xl font-bold mb-6 gradient-text drop-shadow-lg">Ready to find your learning soulmate?</h2>
            <p className="text-2xl text-white/90 dark:text-white/90 mb-8 font-semibold">Sign up now and join a pod of passionate learners. Your journey to authentic connection starts here.</p>
            <SignUpButton>
                <button className="glass-button text-xl px-8 py-4">Get Started</button>
            </SignUpButton>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-white/80 text-lg z-10 font-medium drop-shadow">
        Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
} 