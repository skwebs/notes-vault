import { LoginForm } from "@/features/auth/components/LoginForm";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Anshu Memorial Academy</h1>
            <p className="text-sm text-muted-foreground">Secure vault for your school notes</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
