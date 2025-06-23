"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { io, Socket } from "socket.io-client"

export const dynamic = "force-dynamic";

interface WebSocketMessage {
  userId: string
  podId: string
  content: string
  timestamp: Date
}

interface UseWebSocketReturn {
  isConnected: boolean
  sendMessage: (podId: string, content: string) => void
  joinPod: (podId: string) => void
  leavePod: (podId: string) => void
  messages: WebSocketMessage[]
  error: string | null
}

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<WebSocketMessage[]>([])
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Initialize socket connection
  useEffect(() => {
    // Get token from cookies
    const getToken = () => {
      if (typeof document === 'undefined') return null
      return document.cookie
        .split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]
    }

    const token = getToken()
    if (!token) return

    const socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
      auth: { token }
    })

    socketRef.current = socket

    // Connection events
    socket.on("connect", () => {
      console.log("WebSocket connected")
      setIsConnected(true)
      setError(null)
    })

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    })

    socket.on("error", (error: { message: string }) => {
      console.error("WebSocket error:", error)
      setError(error.message)
    })

    // Message events
    socket.on("newMessage", (message: WebSocketMessage) => {
      setMessages(prev => [...prev, message])
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  // Send message
  const sendMessage = useCallback((podId: string, content: string) => {
    if (!socketRef.current || !isConnected) {
      setError("Not connected to WebSocket")
      return
    }

    socketRef.current.emit("sendMessage", { podId, content })
  }, [isConnected])

  // Join pod room
  const joinPod = useCallback((podId: string) => {
    if (!socketRef.current || !isConnected) {
      setError("Not connected to WebSocket")
      return
    }

    socketRef.current.emit("joinPod", podId)
  }, [isConnected])

  // Leave pod room
  const leavePod = useCallback((podId: string) => {
    if (!socketRef.current || !isConnected) {
      setError("Not connected to WebSocket")
      return
    }

    socketRef.current.emit("leavePod", podId)
  }, [isConnected])

  return {
    isConnected,
    sendMessage,
    joinPod,
    leavePod,
    messages,
    error
  }
} 