"use client"
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export interface Message {
  id: string
  userId: string
  username: string
  content: string
  timestamp: string
}

export const useSocket = (podId: string, userId: string, username: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
      addTrailingSlash: false
    })

    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      setIsConnected(true)
      socketInstance.emit('join-pod', podId)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    socketInstance.on('new-message', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      socketInstance.emit('leave-pod', podId)
      socketInstance.disconnect()
    }
  }, [podId])

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.emit('send-message', {
        podId,
        message: content,
        userId,
        username
      })
    }
  }

  return {
    messages,
    isConnected,
    sendMessage
  }
} 