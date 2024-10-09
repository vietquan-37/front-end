import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      token: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    
      token: string;
      role: string;
  
  }
}