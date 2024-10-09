import { http } from "@/utils/config";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "sign in",
            credentials: {
                username: { label: "username", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials, request) {
                try {
                    const response = await http.post("/api/authentication/login", {
                        username: credentials?.username as string,
                        password: credentials?.password as string,
                    });
                    const user = response?.data;
                    if (user?.success === true && user?.token) {
                        return user; // Trả về object user nếu thành công
                    } else {
                        console.log("Error: Invalid response format", user);
                    }
                } catch (error) {
                    console.log("Error in authorize:", error);
                }
                return null; // Trả về null nếu có lỗi
            }
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 1 * 60 * 60, // Thời gian sống của token là 1 giờ
    },
    callbacks: {
        signIn: async ({ user, account, profile }) => {
            if (account?.provider === "credentials" && user) {
                return true; // Đăng nhập thành công
            }
            return false; // Đăng nhập thất bại
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.token = user.token; // Lưu token từ user vào token object
                token.role = user.role; // Lưu role từ user vào token object
            }
            return token;
        },
        session: async ({ session, token }) => {
            session.user = {
                ...session.user,
                token: token.token as string, // Gán token vào session
                role: token.role as string,   // Gán role vào session
            };
            return session;
        },
    },
    pages: {
        signIn: "/login", // Trang đăng nhập
    },
};
