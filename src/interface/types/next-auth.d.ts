import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
    interface User {
        user: UserInfoI
        token: string
    }
    interface UserInfoI {
        name: string
        email: string
        role: string
    }
    interface Session {
        user?: UserInfoI
        token?: string
        id?: string
    }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: import("next-auth").UserInfoI
    token?: string
    idToken?: string
    id?: string
  }
}