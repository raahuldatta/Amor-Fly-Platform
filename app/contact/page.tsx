"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ParallaxContainer } from "@/components/ui/parallax-container"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, Sun, Moon, Monitor, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => { setMounted(true) }, [])

  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsLoading(false)
    setIsSuccess(true)
    setTimeout(() => setIsSuccess(false), 3000)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden">
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
      <div className="container mx-auto px-4 py-16 z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">Contact Us</h1>
          <p className="text-2xl text-white/80 max-w-3xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-card p-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium gradient-text">Email</h3>
                  <p className="text-white/80">raahuldatta@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium gradient-text">Phone</h3>
                  <p className="text-white/80">+91-6301-995818</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium gradient-text">Location</h3>
                  <p className="text-white/80">Hyderabad, India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold mb-6 gradient-text">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input type="text" placeholder="Your Name" className="glass-effect" required />
              </div>
              <div>
                <Input type="email" placeholder="Your Email" className="glass-effect" required />
              </div>
              <div>
                <Input type="text" placeholder="Subject" className="glass-effect" required />
              </div>
              <div>
                <Textarea placeholder="Your Message" className="glass-effect min-h-[150px]" required />
              </div>
              <Button type="submit" className="liquid-button w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Message"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
              {isSuccess && (
                <p className="text-green-400 text-center">Message sent successfully!</p>
              )}
            </form>
          </div>
        </div>
      </div>
      <footer className="w-full py-8 text-center text-white/80 text-lg z-10 font-medium drop-shadow">
        Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
} 