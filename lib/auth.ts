import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DEMO_CURRENT_USER_ID, DEMO_USERS } from "@/lib/demo";
import type { AppUser } from "@/lib/types";

const hasGoogleProvider = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const isRealAuthConfigured = hasGoogleProvider;

const providers = hasGoogleProvider
  ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
  : [];

export const { handlers, auth: nextAuth, signIn, signOut } = NextAuth({
  providers,
  pages: { signIn: "/auth" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "questforge-dev-secret-not-for-production",
  trustHost: true,
});

const DEMO_USER: AppUser = DEMO_USERS.find((u) => u.id === DEMO_CURRENT_USER_ID) ?? DEMO_USERS[0];

/**
 * Unified session accessor for every server component / API route. Falls
 * back to a fixed demo persona when no OAuth provider is configured, so the
 * whole app is explorable with zero setup.
 */
export async function getCurrentUser(): Promise<AppUser> {
  if (!isRealAuthConfigured) return DEMO_USER;

  try {
    const session = await nextAuth();
    if (session?.user?.email) {
      return {
        id: session.user.email,
        email: session.user.email,
        name: session.user.name ?? session.user.email,
        image: session.user.image,
        nickname: null,
        preferredRole: "both",
        isPremium: false,
        aiCredits: 20,
      };
    }
  } catch {
    // fall through to demo user — auth must never crash the app
  }
  return DEMO_USER;
}
