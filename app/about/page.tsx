"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ParallaxContainer } from "@/components/ui/parallax-container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, BookOpen, TrendingUp, Sun, Moon, Monitor, Heart } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  useEffect(() => { setMounted(true) }, [])
  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
      {mounted && (
        <>
          <div className="fixed inset-0 w-full h-full z-0" style={{ background: "linear-gradient(120deg, #f8e1ef 0%, #e0c3fc 100%)" }} />
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
      <div className="container mx-auto px-4 py-16 z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">About Amor Fly</h1>
          <p className="text-2xl text-white/80 max-w-3xl mx-auto">Empowering individuals through meaningful connections and collaborative learning</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 h-full flex flex-col items-center text-center">
            <Users className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">Community</h3>
            <p className="text-white/80">Connect with like-minded individuals who share your passion for growth and learning</p>
          </div>
          <div className="glass-card p-8 h-full flex flex-col items-center text-center">
            <BookOpen className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">Learning Pods</h3>
            <p className="text-white/80">Join small, focused groups to learn and grow together in a supportive environment</p>
          </div>
          <div className="glass-card p-8 h-full flex flex-col items-center text-center">
            <TrendingUp className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2 gradient-text">Growth Tracking</h3>
            <p className="text-white/80">Monitor your progress and celebrate achievements with your learning community</p>
          </div>
        </div>
        <div className="glass-card p-10 mb-16">
          <h2 className="text-3xl font-bold mb-6 gradient-text text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">Authenticity</h3>
              <p className="text-white/80">We believe in genuine connections and honest self-expression</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">Growth Mindset</h3>
              <p className="text-white/80">Embracing challenges and learning from every experience</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 gradient-text">Community Support</h3>
              <p className="text-white/80">Building a network of support and encouragement</p>
            </div>
          </div>
        </div>
        <div className="text-center">
          <Link href="/sign-up">
            <button className="glass-button text-lg px-8 py-6">Join Our Community</button>
          </Link>
        </div>
      </div>
      <footer className="w-full py-8 text-center text-white/80 text-lg z-10 font-medium drop-shadow">
        Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
} 