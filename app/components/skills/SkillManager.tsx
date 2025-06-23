"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

interface Skill {
  name: string
  level: string
  addedAt: Date
}

const LEVELS = ["beginner", "intermediate", "advanced", "expert"];
const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};
const LEVEL_PROGRESS: Record<string, number> = {
  beginner: 25,
  intermediate: 50,
  advanced: 75,
  expert: 100,
};

export function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSkill, setNewSkill] = useState("")
  const [skillLevel, setSkillLevel] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await fetch("/api/user/skills")
      if (!response.ok) throw new Error("Failed to fetch skills")
      const data = await response.json()
      setSkills(data.skills)
    } catch (error) {
      console.error("Error fetching skills:", error)
      toast.error("Failed to load skills")
    } finally {
      setIsLoading(false)
    }
  }

  const addSkill = async () => {
    if (!newSkill || !skillLevel) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      const response = await fetch("/api/user/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: newSkill, level: skillLevel }),
      })

      if (!response.ok) throw new Error("Failed to add skill")

      toast.success("Skill added successfully")
      setNewSkill("")
      setSkillLevel("")
      setIsDialogOpen(false)
      fetchSkills()
    } catch (error) {
      console.error("Error adding skill:", error)
      toast.error("Failed to add skill")
    }
  }

  const removeSkill = async (skillName: string) => {
    try {
      const response = await fetch(`/api/user/skills?skill=${encodeURIComponent(skillName)}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to remove skill")

      toast.success("Skill removed successfully")
      fetchSkills()
    } catch (error) {
      console.error("Error removing skill:", error)
      toast.error("Failed to remove skill")
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-blue-500"
      case "intermediate":
        return "bg-green-500"
      case "advanced":
        return "bg-purple-500"
      case "expert":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const updateSkillLevel = async (skillName: string, newLevel: string) => {
    try {
      const response = await fetch("/api/user/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill: skillName, level: newLevel }),
      })

      if (!response.ok) throw new Error("Failed to update skill level")

      toast.success("Skill level updated successfully")
      fetchSkills()
    } catch (error) {
      console.error("Error updating skill level:", error)
      toast.error("Failed to update skill level")
    }
  }

  if (isLoading) {
    return <div>Loading skills...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Skills</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Skill</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="skill">Skill Name</label>
                <Input
                  id="skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., JavaScript"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="level">Skill Level</label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addSkill} className="w-full">
                Add Skill
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {skills.length === 0 ? (
        <p className="text-muted-foreground">No skills added yet. Add your first skill!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{skill.name}</h3>
                <Badge className={getLevelColor(skill.level)}>{skill.level}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSkill(skill.name)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 