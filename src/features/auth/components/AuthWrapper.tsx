"use client";

import { Lock } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function AuthWrapper({ children, title, description, className }: AuthWrapperProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-br from-background via-muted/50 to-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/20">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Notes Vault</h1>
            <p className="text-sm text-muted-foreground">Secure your knowledge, simplify your life</p>
          </div>
        </div>
        
        <Card className={cn("border-none shadow-2xl ring-1 ring-foreground/5", className)}>
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
          {children}
        </Card>
      </div>
    </div>
  );
}
