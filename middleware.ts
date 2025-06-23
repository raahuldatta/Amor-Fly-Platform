import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  // This matcher is intentionally broad to capture all requests for debugging.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/webhooks/clerk (the webhook route)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/webhooks/clerk|_next/static|_next/image|favicon.ico).*)',
    '/',
  ],
}; 