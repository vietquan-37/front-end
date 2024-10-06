
import { http } from "@/utils/config";
import { AuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "sign in",
            credentials: {
                username: {
                    label: "username",
                    type: "text",
                },
                password: {
                    label: "password",
                    type: "password",
                },
            },
            async authorize(credentials, request) {
                try {
                    const response = await http.post("/api/authentication/login", {
                        username: credentials?.username as string,
                        password: credentials?.password as string,
                    });

                    // console.log(response.data);

                    const user = response.data;
                    if (user.status === 200 && user) {
                        // console.log(user);

                        // console.log('return data user 200: ', user);

                        return user;
                    }
                } catch (error) {
                    console.log(error);
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 1 * 60 * 60,
    },
    callbacks: {
        signIn: async ({ user, account, profile }) => {
            if (account?.provider === "credentials") {
                // console.log('login credentials', account?.provider);

                return true;
            }
            return false;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.access_token = user?.data.accessToken;

                token.role = user.data?.role;
            }
            return token;
        },

        session: async ({ session, token, user }) => {
            session.user.access = token.access_token as string;

            session.user.role = token.role as string;
            return session;
        },
    },
    pages: {
        signIn: "/login",
        // newUser: "/auth/register",
    },
    // secret: process.env.NEXTAUTH_SECRET,
};
