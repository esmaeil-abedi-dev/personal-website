import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add CORS headers for API routes
    if (req.nextUrl.pathname.startsWith("/api/")) {
      const response = NextResponse.next()
      response.headers.set("Access-Control-Allow-Origin", "*")
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
      return response
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
}
