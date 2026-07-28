import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn, Sparkles } from "lucide-react";
import { Logo } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { isRealAuthConfigured, signIn } from "@/lib/auth";

export const metadata = { title: "Accedi" };

export default function AuthPage() {
  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo: "/dashboard" });
  }

  async function continueDev() {
    "use server";
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-16">
      <Logo />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Accedi a QuestForge</CardTitle>
          <CardDescription>Crea la scena. Gioca l&apos;avventura.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isRealAuthConfigured ? (
            <form action={signInWithGoogle}>
              <Button type="submit" className="w-full" variant="secondary">
                <LogIn className="size-4" /> Continua con Google
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <Badge variant="warning" className="w-full justify-center py-2">
                Modalità demo — nessun provider OAuth configurato
              </Badge>
              <form action={continueDev}>
                <Button type="submit" className="w-full">
                  <Sparkles className="size-4" /> Entra come Marco (demo)
                </Button>
              </form>
              <p className="text-center text-xs text-muted">
                Imposta <code className="font-mono">GOOGLE_CLIENT_ID</code> e{" "}
                <code className="font-mono">GOOGLE_CLIENT_SECRET</code> per abilitare il login reale.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Link href="/" className="text-sm text-muted hover:text-foreground">
        ← Torna alla home
      </Link>
    </div>
  );
}
