"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ParallaxContainer } from "@/components/ui/parallax-container"
import { Button } from "@/components/ui/button"
import { ArrowRight, UserPlus, Users, Rocket, Heart, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6 animate-bounce-in">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 animate-fade-in-up">
            How It Works
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-delay">
            Your journey to growth and connection starts here
          </p>
        </div>

        {/* Steps Section */}
        <div className="space-y-12 mb-16">
          {/* Step 1 */}
          <div className="glass-card p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up">
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 gradient-text">Step 1: Create Your Profile</h3>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Start by creating your profile. Tell us about your interests, goals, and what you'd like to learn.
                  We'll use this information to match you with the perfect learning pod.
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-3 text-lg">
                  <li>Select your skills and interests</li>
                  <li>Complete your personality assessment</li>
                  <li>Set your learning goals</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 gradient-text">Step 2: Join a Learning Pod</h3>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Get matched with a small group of learners who share your interests and goals.
                  Your pod becomes your support system and accountability partners.
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-3 text-lg">
                  <li>Get matched with compatible learners</li>
                  <li>Join your dedicated learning pod</li>
                  <li>Connect with your pod members</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card p-8 hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-start gap-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg hover:scale-110 transition-transform duration-300">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-4 gradient-text">Step 3: Learn and Grow Together</h3>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">
                  Engage with your pod members, track your progress, and celebrate achievements together.
                  Our platform provides tools and resources to support your learning journey.
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-3 text-lg">
                  <li>Participate in group activities</li>
                  <li>Track your learning progress</li>
                  <li>Celebrate milestones together</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold gradient-text mb-2">Community First</h4>
            <p className="text-white/70">Build meaningful connections with like-minded learners</p>
          </div>
          
          <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold gradient-text mb-2">Goal-Oriented</h4>
            <p className="text-white/70">Stay focused and achieve your learning objectives</p>
          </div>
          
          <div className="glass-card p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold gradient-text mb-2">Progress Tracking</h4>
            <p className="text-white/70">Monitor your growth and celebrate achievements</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
          <div className="glass-card p-8 inline-block">
            <div className="flex items-center justify-center space-x-4">
              <Heart className="w-8 h-8 text-pink-400" />
              <Link href="/sign-up">
                <Button className="glass-button text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 