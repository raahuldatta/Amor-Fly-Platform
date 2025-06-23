"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { ParallaxContainer } from "@/components/ui/parallax-container"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, PenTool, Music, Languages, Brain, Users, Sun, Moon, Monitor, Heart, Check, Plus, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { Animated3DBackground } from "@/components/ui/animated-3d-background"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Skill {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface UserSkill {
  name: string;
  level: string;
  addedAt: string;
}

const skills: Skill[] = [
  {
    name: "Programming",
    description: "Learn coding and software development with hands-on projects",
    icon: Code,
    color: "from-blue-500 to-cyan-500"
  },
  {
    name: "Writing",
    description: "Develop your writing skills through creative and technical writing",
    icon: PenTool,
    color: "from-purple-500 to-pink-500"
  },
  {
    name: "Music",
    description: "Explore music theory, composition, and instrument playing",
    icon: Music,
    color: "from-yellow-500 to-orange-500"
  },
  {
    name: "Art & Design",
    description: "Master digital art, graphic design, and visual communication",
    icon: PenTool,
    color: "from-green-500 to-emerald-500"
  },
  {
    name: "Languages",
    description: "Learn new languages through immersive conversation practice",
    icon: Languages,
    color: "from-red-500 to-rose-500"
  },
  {
    name: "Mindfulness",
    description: "Develop mindfulness and meditation practices",
    icon: Brain,
    color: "from-indigo-500 to-violet-500"
  },
  {
    name: "Leadership",
    description: "Build leadership skills and team management abilities",
    icon: Users,
    color: "from-amber-500 to-yellow-500"
  }
]

export default function SkillsPage() {
  const [mounted, setMounted] = useState(false);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [skillLevel, setSkillLevel] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const { isSignedIn, userId } = useAuth();

  useEffect(() => { 
    setMounted(true); 
    if (isSignedIn) {
      fetchUserSkills();
    }
  }, [isSignedIn]);

  const fetchUserSkills = async () => {
    try {
      const response = await fetch("/api/user/skills");
      if (response.ok) {
        const data = await response.json();
        setUserSkills(data.skills || []);
      }
    } catch (error) {
      console.error("Error fetching user skills:", error);
    }
  };

  const addSkill = async () => {
    if (!selectedSkill || !skillLevel) {
      toast.error("Please select a skill level");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          skill: selectedSkill.name, 
          level: skillLevel 
        }),
      });

      if (response.ok) {
        toast.success(`${selectedSkill.name} added to your skills!`);
        await fetchUserSkills();
        setIsDialogOpen(false);
        setSkillLevel("");
        setSelectedSkill(null);
      } else {
        toast.error("Failed to add skill");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      toast.error("Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const removeSkill = async (skillName: string) => {
    try {
      const response = await fetch(`/api/user/skills?skill=${encodeURIComponent(skillName)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`${skillName} removed from your skills`);
        await fetchUserSkills();
      } else {
        toast.error("Failed to remove skill");
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      toast.error("Failed to remove skill");
    }
  };

  const isSkillAdded = (skillName: string) => {
    return userSkills.some(skill => skill.name === skillName);
  };

  const getSkillLevel = (skillName: string) => {
    const skill = userSkills.find(skill => skill.name === skillName);
    return skill ? skill.level : null;
  };

  const handleSkillClick = (skill: Skill) => {
    if (!isSignedIn) {
      toast.error("Please sign in to add skills");
      return;
    }
    
    if (isSkillAdded(skill.name)) {
      // Skill already added, show remove option
      if (confirm(`Remove ${skill.name} from your skills?`)) {
        removeSkill(skill.name);
      }
    } else {
      // Add new skill
      setSelectedSkill(skill);
      setIsDialogOpen(true);
    }
  };

  const handleThemeToggle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Animated3DBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-2xl mx-auto mb-6 animate-bounce-in">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4 animate-fade-in-up">
            Available Skills
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto animate-fade-in-delay">
            {isSignedIn 
              ? "Add skills to your dashboard and track your learning progress" 
              : "Sign in to add skills to your dashboard and start your learning journey"
            }
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {skills.map((skill, index) => {
            const isAdded = isSkillAdded(skill.name);
            const skillLevel = getSkillLevel(skill.name);
            
            return (
              <div 
                key={skill.name} 
                className="glass-card p-8 h-full flex flex-col items-center text-center hover:scale-105 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${skill.color} flex items-center justify-center mb-6 shadow-lg hover:scale-110 transition-transform duration-300`}>
                  <skill.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-3">{skill.name}</h3>
                <p className="text-white/80 mb-8 text-lg leading-relaxed">{skill.description}</p>
                
                {isSignedIn ? (
                  <div className="w-full">
                    {isAdded ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 text-green-400 bg-green-400/10 px-4 py-2 rounded-full">
                          <Check className="w-5 h-5" />
                          <span className="text-sm font-semibold">Added ({skillLevel})</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleSkillClick(skill)}
                          className="w-full text-red-400 border-red-400 hover:bg-red-400 hover:text-white transition-all duration-300"
                        >
                          Remove Skill
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleSkillClick(skill)}
                        className="glass-button w-full hover:bg-white/30 transition-all duration-300"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Add to Dashboard
                      </Button>
                    )}
                  </div>
                ) : (
                  <Link href="/sign-in">
                    <Button className="glass-button w-full hover:bg-white/30 transition-all duration-300">
                      Sign In to Add <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Call to Action Section */}
        {isSignedIn && (
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="glass-card p-8 inline-block">
              <div className="flex items-center justify-center space-x-4">
                <TrendingUp className="w-8 h-8 text-pink-400" />
                <Link href="/dashboard">
                  <Button className="glass-button text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                    View Your Skills Dashboard <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
        
        {!isSignedIn && (
          <div className="text-center animate-fade-in-up">
            <div className="glass-card p-8 inline-block">
              <div className="flex items-center justify-center space-x-4">
                <Heart className="w-8 h-8 text-pink-400" />
                <Link href="/sign-in">
                  <Button className="glass-button text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                    Begin Your Learning Journey <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Skill Level Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/20 bg-white/20 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">
              Add {selectedSkill?.name} to Your Skills
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <label htmlFor="level" className="text-white/80 font-medium">Skill Level</label>
              <Select value={skillLevel} onValueChange={setSkillLevel}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white focus:bg-white/20">
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent className="bg-white/20 backdrop-blur-xl border-white/20">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={addSkill} 
              className="w-full glass-button hover:bg-white/30 transition-all duration-300" 
              disabled={loading || !skillLevel}
            >
              {loading ? "Adding..." : "Add Skill"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-white/80 text-lg font-medium drop-shadow">
        Made with <span className="text-pink-400">♥</span> by Amor Fly Team &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
} 