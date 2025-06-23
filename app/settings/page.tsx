"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Moon, Palette, Shield, User, ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"
import Link from "next/link"

export default function SettingsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    podUpdates: true,
    connectionRequests: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showSkills: true,
  })

  const [theme, setTheme] = useState({
    darkMode: true,
    highContrast: false,
  })

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="glass-card border-white/20 bg-white/20 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Settings</h1>
                  <p className="text-white/80">Customize your learning experience</p>
                </div>
              </div>
              <Link href="/dashboard">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="glass-button hover:bg-white/30 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="account" className="space-y-8">
            <TabsList className="glass-card grid w-full grid-cols-4 p-1">
              <TabsTrigger value="account" className="glass-button data-[state=active]:bg-white/30">
                <User className="w-4 h-4 mr-2" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="glass-button data-[state=active]:bg-white/30">
                <Bell className="w-4 h-4 mr-2" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="glass-button data-[state=active]:bg-white/30">
                <Shield className="w-4 h-4 mr-2" />
                <span>Privacy</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="glass-button data-[state=active]:bg-white/30">
                <Palette className="w-4 h-4 mr-2" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold gradient-text mb-2">Account Settings</h2>
                  <p className="text-white/80">Manage your account information and preferences</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      className="glass-effect bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-white font-medium">Change Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      className="glass-effect bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="anonymousName" className="text-white font-medium">Anonymous Name</Label>
                    <Input 
                      id="anonymousName" 
                      placeholder="Your anonymous name" 
                      className="glass-effect bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20" 
                    />
                  </div>
                  <Button className="glass-button hover:bg-white/30 transition-all duration-300">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold gradient-text mb-2">Notification Preferences</h2>
                  <p className="text-white/80">Choose what notifications you want to receive</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Email Notifications</Label>
                        <p className="text-sm text-white/60">Receive notifications via email</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Push Notifications</Label>
                        <p className="text-sm text-white/60">Receive notifications in your browser</p>
                      </div>
                      <Switch 
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Pod Updates</Label>
                        <p className="text-sm text-white/60">Get notified about pod activities</p>
                      </div>
                      <Switch 
                        checked={notifications.podUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, podUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Connection Requests</Label>
                        <p className="text-sm text-white/60">Get notified about new connection requests</p>
                      </div>
                      <Switch 
                        checked={notifications.connectionRequests}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, connectionRequests: checked })}
                      />
                    </div>
                  </div>
                  <Button className="glass-button hover:bg-white/30 transition-all duration-300">
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold gradient-text mb-2">Privacy Settings</h2>
                  <p className="text-white/80">Control your privacy and visibility</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Profile Visibility</Label>
                        <p className="text-sm text-white/60" id="profile-visibility-desc">Control who can see your profile</p>
                      </div>
                      <select
                        aria-label="Profile Visibility"
                        aria-describedby="profile-visibility-desc"
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="glass-effect bg-white/10 border-white/20 text-white rounded-md px-3 py-2 focus:bg-white/20"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="connections">Connections Only</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Show Email</Label>
                        <p className="text-sm text-white/60">Display your email to other users</p>
                      </div>
                      <Switch 
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showEmail: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Show Skills</Label>
                        <p className="text-sm text-white/60">Display your skills on your profile</p>
                      </div>
                      <Switch 
                        checked={privacy.showSkills}
                        onCheckedChange={(checked) => setPrivacy({ ...privacy, showSkills: checked })}
                      />
                    </div>
                  </div>
                  <Button className="glass-button hover:bg-white/30 transition-all duration-300">
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-8 animate-fade-in">
              <div className="glass-card p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold gradient-text mb-2">Appearance Settings</h2>
                  <p className="text-white/80">Customize your app experience</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">Dark Mode</Label>
                        <p className="text-sm text-white/60">Enable dark mode for better visibility</p>
                      </div>
                      <Switch 
                        checked={theme.darkMode}
                        onCheckedChange={(checked) => setTheme({ ...theme, darkMode: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="space-y-1">
                        <Label className="text-white font-medium">High Contrast</Label>
                        <p className="text-sm text-white/60">Enable high contrast mode</p>
                      </div>
                      <Switch 
                        checked={theme.highContrast}
                        onCheckedChange={(checked) => setTheme({ ...theme, highContrast: checked })}
                      />
                    </div>
                  </div>
                  <Button className="glass-button hover:bg-white/30 transition-all duration-300">
                    <Save className="w-4 h-4 mr-2" />
                    Save Appearance Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 