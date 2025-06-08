import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

console.log(process.env.NEXTAUTH_SECRET)

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
