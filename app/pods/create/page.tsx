"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Heart } from "lucide-react";

export default function CreatePodPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    skill: "",
    skillLevel: "beginner",
    maxMembers: 4,
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to create a pod",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/pods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // The userId will be picked up from the session on the server
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pod created successfully!",
        });
        router.push(`/pods/${data.podId}`);
      } else {
        throw new Error(data.error || "Failed to create pod");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create pod",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg gradient-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background p-8">
      {/* Floating hearts background */}
      <div className="hearts-bg">
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
        <div className="heart" />
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8">
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Create a Pod</h1>
              <p className="text-muted-foreground mt-2">
                Start a new learning pod and invite others to join
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="skill"
                  className="text-sm font-medium text-white"
                >
                  Skill
                </label>
                <Input
                  id="skill"
                  value={formData.skill}
                  onChange={(e) =>
                    setFormData({ ...formData, skill: e.target.value })
                  }
                  placeholder="e.g., JavaScript, Python, Design"
                  className="bg-white/10 border-white/20 text-white placeholder:text-muted-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="skillLevel"
                  className="text-sm font-medium text-white"
                >
                  Skill Level
                </label>
                <Select
                  value={formData.skillLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, skillLevel: value })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/20">
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="maxMembers"
                  className="text-sm font-medium text-white"
                >
                  Maximum Members
                </label>
                <Select
                  value={formData.maxMembers.toString()}
                  onValueChange={(value) =>
                    setFormData({ ...formData, maxMembers: parseInt(value) })
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select max members" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-white/20">
                    <SelectItem value="2">2 members</SelectItem>
                    <SelectItem value="3">3 members</SelectItem>
                    <SelectItem value="4">4 members</SelectItem>
                    <SelectItem value="5">5 members</SelectItem>
                    <SelectItem value="6">6 members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-white"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your pod's goals and expectations..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-muted-foreground min-h-[100px]"
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 glass-button bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isLoaded}
                  className="flex-1 glass-button"
                >
                  {isLoading ? "Creating..." : "Create Pod"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 