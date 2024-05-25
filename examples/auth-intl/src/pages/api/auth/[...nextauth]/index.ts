import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin", value: "admin" },
                password: { label: "Password", type: "password", placeholder: "admin", value: "admin" },
            },
            async authorize(credentials) {
                if (credentials?.username === "admin" && credentials.password === "admin") {
                    return {
                        id: "user-id",
                        name: credentials.username,
                    };
                }
                return null;
            },
        }),
    ],
};

export default NextAuth(authOptions);
