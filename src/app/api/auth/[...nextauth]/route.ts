import { NextRequest, NextResponse } from "next/server";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [],
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          organizationId: "org-1",
          organizationName: "Demo Organization",
          role: "ADMIN"
        }
      };
    }
  }
};

// Mock implementation of NextAuth routes
export async function GET(req: NextRequest) {
  return NextResponse.json({
    user: {
      id: "user-1",
      name: "Demo User",
      email: "demo@example.com",
      organizationId: "org-1",
      organizationName: "Demo Organization",
      role: "ADMIN"
    }
  });
}

export async function POST(req: NextRequest) {
  // Mock sign-in response
  return NextResponse.json({
    ok: true,
    url: "/dashboard",
    user: {
      id: "user-1",
      name: "Demo User",
      email: "demo@example.com",
      organizationId: "org-1",
      organizationName: "Demo Organization",
      role: "ADMIN"
    }
  });
} 