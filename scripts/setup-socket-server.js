// Socket.io Server Setup for Real-time Features
const { createServer } = require("http")
const { Server } = require("socket.io")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)

  const io = new Server(httpServer, {
    path: "/api/socket/io",
    addTrailingSlash: false,
  })

  // Socket.io connection handling
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    // Join chat room
    socket.on("join-chat", (chatId) => {
      socket.join(chatId)
      console.log(`User ${socket.id} joined chat ${chatId}`)
    })

    // Join pod room
    socket.on("join-pod", (podId) => {
      socket.join(podId)
      console.log(`User ${socket.id} joined pod ${podId}`)
    })

    // Handle new messages
    socket.on("send-message", (data) => {
      socket.to(data.chatId).emit("new-message", data.message)
    })

    // Handle typing indicators
    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("user-typing", {
        userId: socket.id,
        isTyping: data.isTyping,
      })
    })

    // Handle user online status
    socket.on("user-online", (data) => {
      socket.broadcast.emit("user-online", {
        userId: data.userId,
        isOnline: true,
      })
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
      socket.broadcast.emit("user-online", {
        userId: socket.id,
        isOnline: false,
      })
    })
  })

  httpServer
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
