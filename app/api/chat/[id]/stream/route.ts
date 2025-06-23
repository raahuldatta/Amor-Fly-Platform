import type { NextRequest } from "next/server"
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }

  const chatId = params.id

  // Create a readable stream for Server-Sent Events
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(`data: ${JSON.stringify({ type: "connected", chatId })}\n\n`)

      // Set up periodic heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(`data: ${JSON.stringify({ type: "heartbeat", timestamp: Date.now() })}\n\n`)
      }, 30000)

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
