"use client"

import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Send, Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  _id: string
  content: string
  senderId: string
  username: string
  createdAt: string
  likes: number
}

interface PodChatProps {
  podId: string
  userId: string
  username: string
}

export function PodChat({ podId, userId, username }: PodChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/pods/${podId}/messages`)
        if (!response.ok) throw new Error('Failed to fetch messages')
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          variant: 'destructive',
        })
      }
    }

    fetchMessages()
  }, [podId, toast])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/pods/${podId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!response.ok) throw new Error('Failed to send message')
      
      const sentMessage = await response.json()
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/20">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold gradient-text">Pod Chat</h3>
          <p className="text-sm text-muted-foreground">Share your learning journey</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg gradient-text mb-2">Start the conversation!</p>
            <p className="text-muted-foreground">Be the first to share your thoughts</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-[70%] ${message.senderId === userId ? 'order-2' : 'order-1'}`}>
                <div
                  className={`glass-card p-4 ${
                    message.senderId === userId
                      ? 'bg-gradient-to-r from-pink-400/20 to-purple-400/20 border-pink-300/30'
                      : 'bg-white/10 border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-xs">
                        {message.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                      {message.username}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-white">{message.content}</p>
                  {message.likes > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Heart className="h-3 w-3 text-pink-400 fill-pink-400" />
                      <span className="text-xs text-muted-foreground">{message.likes}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/20">
        <div className="flex gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Share your thoughts..."
            disabled={isLoading}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-muted-foreground focus:border-pink-300/50"
          />
          <Button 
            type="submit" 
            disabled={isLoading || !newMessage.trim()}
            className="glass-button px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
} 