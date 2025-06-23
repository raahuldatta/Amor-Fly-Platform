import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    })

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)

      socket.on('join-pod', (podId: string) => {
        socket.join(podId)
        console.log(`Socket ${socket.id} joined pod ${podId}`)
      })

      socket.on('leave-pod', (podId: string) => {
        socket.leave(podId)
        console.log(`Socket ${socket.id} left pod ${podId}`)
      })

      socket.on('send-message', (data: { podId: string; message: string; userId: string; username: string }) => {
        io.to(data.podId).emit('new-message', {
          id: Date.now().toString(),
          content: data.message,
          userId: data.userId,
          username: data.username,
          timestamp: new Date().toISOString()
        })
      })

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })

    res.socket.server.io = io
  }
  return res.socket.server.io
} 