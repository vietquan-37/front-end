import NextAuth, { DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
// Cấu hình NextAuth
export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/authentication/login`, {
          method: "POST",
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        if (res.ok && user) {
          return { token: user.token, role: user.role }; // Đảm bảo trả về token và role
        } else {
          return null; // Trả về null nếu không thành công
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.token = user.token; // Lưu token vào JWT
        token.role = user.role;   // Lưu role vào JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.token = token.token; // Lưu token vào session
      session.user.role = token.role;   // Lưu role vào session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Đường dẫn đến trang đăng nhập của bạn
  },
});
