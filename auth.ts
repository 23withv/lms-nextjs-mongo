import NextAuth from "next-auth"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/lib/db"
import { ObjectId } from "mongodb"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/models/User"
import { connectToDatabase } from "@/lib/mongoose"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  
  events: {
    async createUser({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("lms-platform");
        const usersCollection = db.collection("users");
        const userIdObject = new ObjectId(user.id);

        await usersCollection.updateOne(
          { _id: userIdObject }, 
          {
            $set: {
              createdAt: new Date(),
              updatedAt: new Date(),
              provider: "social_login" 
            },
            $setOnInsert: {
                role: "STUDENT" 
            }
          },
          { upsert: true }
        );
      } catch (error) {
        console.error("Failed to update new user details:", error);
      }
    },
  },
  
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email });
        if (!user || !user.password) throw new Error("Invalid credentials");
        
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password as string, 
          user.password
        );
        if (!isPasswordCorrect) throw new Error("Invalid credentials");

        return user;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        try {
            await connectToDatabase();
            const dbUser = await User.findOne({ email: user.email });
            token.role = dbUser?.role || "STUDENT"; 
        } catch (error) {
            console.log("Error fetching role in JWT:", error);
            token.role = "STUDENT";
        }
      }
      
      if (trigger === "update" && session?.user?.role) {
        token.role = session.user.role;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
})