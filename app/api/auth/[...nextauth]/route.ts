import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Remove any console.log statements that might cause issues during build
// console.log(process.env.NEXTAUTH_SECRET)

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
