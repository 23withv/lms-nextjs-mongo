import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; 
      }

      if (isOnAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
        if (user) token.role = user.role;
        if (trigger === "update" && session?.user?.role) token.role = session.user.role;
        return token;
    },
    async session({ session, token }) {
        if (session.user && token.sub) {
            session.user.id = token.sub;
            session.user.role = token.role as string;
        }
        return session;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;