import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4 bg-muted/40">
      <RegisterForm />
    </div>
  );
}
