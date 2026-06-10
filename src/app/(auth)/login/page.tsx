import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted/40">
      <LoginForm />
    </div>
  );
}
