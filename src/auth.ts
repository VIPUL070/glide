import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "./models/User.model"
import bcrypt from "bcryptjs"
import { z } from "zod";
import Google from "next-auth/providers/google"

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "name@gmail.com"
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "•••••"
                }
            },
            authorize: async (credentials) => {
                const parsed = LoginSchema.safeParse(credentials);
                if (!parsed.success) {
                    throw new CredentialsSignin("Invalid inputs");
                }

                const { email, password } = parsed.data;

                await connectDB();
                const user = await User.findOne({
                    email
                })

                if (!user || !user.password) {
                    throw new CredentialsSignin("User not found or invalid password");
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    throw new CredentialsSignin("Invalid password");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google") {
                try {
                    await connectDB();
                    const dbUser = await User.findOne({ email: user.email });
                    if (!dbUser) {
                        await User.create({
                            name: user.name,
                            email: user.email,
                        });
                    }

                    user.id = dbUser._id.toString();
                    user.role = dbUser.role;

                    return true;
                } catch (error) {
                    console.error("Error saving Google user:", error);
                    return false;
                }
            }
            return true; 
        },

        async jwt({ token, user }) {
            if (user) {
                token.name = user.name
                token.id = user.id
                token.email = user.email
                token.role = user.role
            }
            return token
        },

        async session({ session, token }) {
            if (session.user && token) {
                session.user.name = token.name;
                session.user.email = token.email as string;
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/signin',
        error: '/error'
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET
})