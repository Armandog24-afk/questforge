import { LogOut, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentUser, isRealAuthConfigured, signOut } from "@/lib/auth";
import { initials } from "@/lib/utils";

export const metadata = { title: "Profilo" };

export default async function ProfilePage() {
  const user = await getCurrentUser();

  async function handleSignOut() {
    "use server";
    if (isRealAuthConfigured) await signOut({ redirectTo: "/" });
  }

  return (
    <AppShell user={user}>
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Profilo</h1>
        <Card>
          <CardHeader className="flex-row items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent-purple/20 text-lg font-semibold text-accent-purple">
              {initials(user.name)}
            </span>
            <div>
              <CardTitle>{user.nickname ?? user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                Ruolo preferito: {user.preferredRole}
              </Badge>
              <Badge variant={user.isPremium ? "purple" : "outline"}>{user.isPremium ? "Premium" : "Free"}</Badge>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 p-3 text-sm">
              <Sparkles className="size-4 text-accent-purple" />
              {user.aiCredits} crediti IA disponibili
            </div>
            {!isRealAuthConfigured && (
              <Badge variant="warning" className="w-full justify-center py-2">
                Modalità demo — profilo non modificabile
              </Badge>
            )}
          </CardContent>
        </Card>

        {isRealAuthConfigured && (
          <form action={handleSignOut}>
            <Button type="submit" variant="secondary">
              <LogOut className="size-4" /> Esci
            </Button>
          </form>
        )}
      </div>
    </AppShell>
  );
}
